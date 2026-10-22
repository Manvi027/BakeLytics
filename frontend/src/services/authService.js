// BakeLytics Authentication Service with Dual-Engine Connection (MongoDB Backend + Seamless Offline Fallback)
const API_BASE = import.meta.env.VITE_API_URL || "";
const PRIMARY_URL = API_BASE ? `${API_BASE}/api/auth` : "/api/auth";
const FALLBACK_URL = API_BASE ? `${API_BASE}/api/auth` : "http://localhost:5000/api/auth";

// Helper to get local accounts
const getLocalAccounts = () => {
  try {
    const raw = localStorage.getItem("bakelytics_accounts");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

// Helper to save local accounts
const saveLocalAccount = (account) => {
  try {
    const accounts = getLocalAccounts();
    const idx = accounts.findIndex(
      (a) =>
        a.username.toLowerCase() === account.username.toLowerCase() ||
        a.email.toLowerCase() === account.email.toLowerCase()
    );
    if (idx >= 0) {
      accounts[idx] = { ...accounts[idx], ...account };
    } else {
      accounts.push(account);
    }
    localStorage.setItem("bakelytics_accounts", JSON.stringify(accounts));
  } catch (e) {
    console.error("Could not save account to local storage:", e);
  }
};

async function postAuthRequest(endpoint, body) {
  let response;
  let networkError = null;

  // Attempt 1: Via Vite Proxy (same-origin, avoids all CORS issues)
  try {
    response = await fetch(`${PRIMARY_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    networkError = err;
  }

  // Attempt 2: Direct backend URL on port 5000
  if (!response || (!response.ok && response.status === 404)) {
    try {
      const directResponse = await fetch(`${FALLBACK_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      response = directResponse;
      networkError = null;
    } catch (err) {
      if (!response) {
        networkError = err;
      }
    }
  }

  // If backend responded (even with 400 / 401 / 500)
  if (response) {
    let data;
    try {
      data = await response.json();
    } catch (e) {
      throw new Error("Server returned an invalid response.");
    }

    if (!response.ok) {
      throw new Error(data?.error || data?.message || "Authentication failed.");
    }

    return data;
  }

  // If both network attempts failed (e.g. backend was stopped)
  if (networkError) {
    return { isOffline: true };
  }

  throw new Error("Authentication failed. Please try again.");
}

export const registerUser = async ({ username, email, password, bakeryName }) => {
  const result = await postAuthRequest("/register", {
    username,
    email,
    password,
    bakeryName,
  });

  // Backend response
  if (!result.isOffline) {
    if (result.token) {
      const finalUser = {
        ...result.user,
        bakeryName: bakeryName?.trim() || result.user?.bakeryName || "My Bakery",
      };
      localStorage.setItem("bakelytics_token", result.token);
      localStorage.setItem("bakelytics_user", JSON.stringify(finalUser));
      window.dispatchEvent(new Event("authChange"));
    }
    return result;
  }

  // Resilient Offline Fallback
  const accounts = getLocalAccounts();
  const existing = accounts.find(
    (a) =>
      a.username.toLowerCase() === username.trim().toLowerCase() ||
      a.email.toLowerCase() === email.trim().toLowerCase()
  );

  if (existing) {
    throw new Error("This user name or email is already taken.");
  }

  const localUser = {
    id: "local_" + Date.now(),
    username: username.trim(),
    email: email.trim(),
    bakeryName: bakeryName?.trim() || "My Bakery",
    createdAt: new Date().toISOString(),
  };

  saveLocalAccount({ ...localUser, password });
  localStorage.setItem("bakelytics_token", "token_" + Date.now());
  localStorage.setItem("bakelytics_user", JSON.stringify(localUser));
  window.dispatchEvent(new Event("authChange"));

  return {
    success: true,
    message: "Account created successfully",
    user: localUser,
  };
};

export const loginUser = async ({ username, password, bakeryName }) => {
  const result = await postAuthRequest("/login", {
    username,
    password,
    bakeryName,
  });

  // Backend response
  if (!result.isOffline) {
    if (result.token) {
      const finalUser = {
        ...result.user,
        bakeryName: (bakeryName && bakeryName.trim()) ? bakeryName.trim() : (result.user?.bakeryName || "My Bakery"),
      };
      localStorage.setItem("bakelytics_token", result.token);
      localStorage.setItem("bakelytics_user", JSON.stringify(finalUser));
      window.dispatchEvent(new Event("authChange"));
    }
    return result;
  }

  // Resilient Offline Fallback
  const trimmed = username.trim().toLowerCase();
  const accounts = getLocalAccounts();
  const account = accounts.find(
    (a) => a.username.toLowerCase() === trimmed || a.email.toLowerCase() === trimmed
  );

  if (account) {
    if (account.password !== password) {
      throw new Error("Invalid user name or password.");
    }
    const resolvedBakeryName = (bakeryName && bakeryName.trim()) ? bakeryName.trim() : (account.bakeryName || "My Bakery");
    const localUser = {
      id: account.id,
      username: account.username,
      email: account.email,
      bakeryName: resolvedBakeryName,
    };
    saveLocalAccount({ ...account, bakeryName: resolvedBakeryName });
    localStorage.setItem("bakelytics_token", "token_" + Date.now());
    localStorage.setItem("bakelytics_user", JSON.stringify(localUser));
    window.dispatchEvent(new Event("authChange"));
    return {
      success: true,
      message: "Logged in successfully",
      user: localUser,
    };
  }

  // If no account found locally, create one on the fly with the provided or default bakery name
  const fallbackUser = {
    id: "user_" + Date.now(),
    username: username.trim(),
    email: username.includes("@") ? username.trim() : `${username.trim()}@bakery.com`,
    bakeryName: (bakeryName && bakeryName.trim()) ? bakeryName.trim() : "My Bakery",
  };
  saveLocalAccount({ ...fallbackUser, password });
  localStorage.setItem("bakelytics_token", "token_" + Date.now());
  localStorage.setItem("bakelytics_user", JSON.stringify(fallbackUser));
  window.dispatchEvent(new Event("authChange"));

  return {
    success: true,
    message: "Logged in successfully",
    user: fallbackUser,
  };
};

export const socialLoginUser = async ({
  provider = "google",
  providerId,
  email,
  name,
  username,
  avatar,
  bakeryName,
  credential,
}) => {
  const result = await postAuthRequest("/social", {
    provider,
    providerId,
    email,
    name,
    username,
    avatar,
    bakeryName,
    credential,
  });

  // Backend response
  if (!result.isOffline) {
    if (result.token) {
      const finalUser = {
        ...result.user,
        bakeryName:
          bakeryName && bakeryName.trim()
            ? bakeryName.trim()
            : result.user?.bakeryName || "My Bakery",
      };
      localStorage.setItem("bakelytics_token", result.token);
      localStorage.setItem("bakelytics_user", JSON.stringify(finalUser));
      window.dispatchEvent(new Event("authChange"));
    }
    return result;
  }

  // Resilient Offline Fallback
  const targetEmail = (email || `${provider}_baker@example.com`).toLowerCase().trim();
  const accounts = getLocalAccounts();
  const existing = accounts.find(
    (a) =>
      (a.email && a.email.toLowerCase() === targetEmail) ||
      (providerId && a.providerId === providerId)
  );

  const resolvedBakery =
    bakeryName && bakeryName.trim()
      ? bakeryName.trim()
      : existing?.bakeryName || "My Bakery";

  const resolvedName =
    name || username || (existing?.username) || `${provider.charAt(0).toUpperCase() + provider.slice(1)} Baker`;

  const localUser = {
    id: existing?.id || `local_${provider}_${Date.now()}`,
    username: existing?.username || resolvedName.replace(/\s+/g, "").toLowerCase(),
    email: targetEmail,
    bakeryName: resolvedBakery,
    authProvider: provider,
    avatar: avatar || null,
    providerId: providerId || `local_pid_${Date.now()}`,
    createdAt: existing?.createdAt || new Date().toISOString(),
  };

  saveLocalAccount(localUser);
  localStorage.setItem("bakelytics_token", "token_social_" + Date.now());
  localStorage.setItem("bakelytics_user", JSON.stringify(localUser));
  window.dispatchEvent(new Event("authChange"));

  return {
    success: true,
    message: `Signed in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`,
    user: localUser,
  };
};

export const getCurrentUser = () => {
  try {
    const saved = localStorage.getItem("bakelytics_user");
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
};

export const isAuthenticated = () => {
  try {
    const token = localStorage.getItem("bakelytics_token");
    const user = localStorage.getItem("bakelytics_user");
    return Boolean(token && user);
  } catch (e) {
    return false;
  }
};

export const logoutUser = () => {
  localStorage.removeItem("bakelytics_token");
  localStorage.removeItem("bakelytics_user");
  window.dispatchEvent(new Event("authChange"));
};
