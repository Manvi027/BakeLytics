const PRIMARY_URL = "/api/ingredients";
const FALLBACK_URL = "http://localhost:5000/api/ingredients";

const getAuthHeaders = () => {
  const token = localStorage.getItem("bakelytics_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

async function apiRequest(endpoint = "", method = "GET", body = null) {
  let response;
  let networkError = null;

  const url = `${PRIMARY_URL}${endpoint}`;
  const options = {
    method,
    headers: getAuthHeaders(),
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  try {
    response = await fetch(url, options);
  } catch (err) {
    networkError = err;
  }

  // Fallback direct url if proxy 404 or failed
  if (!response || (!response.ok && response.status === 404)) {
    try {
      response = await fetch(`${FALLBACK_URL}${endpoint}`, options);
      networkError = null;
    } catch (err) {
      if (!response) networkError = err;
    }
  }

  if (response) {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error || "Failed inventory request");
    }
    return data;
  }

  if (networkError) {
    return { isOffline: true };
  }

  throw new Error("Unable to communicate with inventory service");
}

export const fetchIngredients = async () => {
  const res = await apiRequest();
  if (res.isOffline) {
    // Offline storage support fallback
    const local = localStorage.getItem("bakelytics_inventory");
    return local ? JSON.parse(local) : [];
  }
  return res.data || [];
};

export const addIngredientApi = async (ingredientData) => {
  const res = await apiRequest("", "POST", ingredientData);
  return res.data;
};

export const updateIngredientApi = async (id, updatedData) => {
  const res = await apiRequest(`/${id}`, "PUT", updatedData);
  return res.data;
};

export const deleteIngredientApi = async (id) => {
  return await apiRequest(`/${id}`, "DELETE");
};

export const bakeDeductApi = async ({ deductions, recipeName, batchCount }) => {
  const res = await apiRequest("/bake-deduct", "POST", {
    deductions,
    recipeName,
    batchCount,
  });
  return res;
};
