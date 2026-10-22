import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "bakelytics_default_jwt_secret_2026",
    {
      expiresIn: "30d",
    }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { username, email, password, bakeryName } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        error: "Please provide user name, email, and password",
      });
    }

    if (username.trim().length < 3) {
      return res.status(400).json({
        error: "User name must be at least 3 characters",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters",
      });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({
      email: email.trim().toLowerCase(),
    });
    if (existingEmail) {
      return res.status(400).json({
        error: "An account with this email already exists",
      });
    }

    // Check if username already exists (case-insensitive)
    const existingUsername = await User.findOne({
      username: { $regex: new RegExp(`^${username.trim()}$`, "i") },
    });
    if (existingUsername) {
      return res.status(400).json({
        error: "This user name is already taken",
      });
    }

    // Create user
    const user = await User.create({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password,
      bakeryName: bakeryName?.trim() || "My Bakery",
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bakeryName: user.bakeryName,
        authProvider: user.authProvider || "local",
        avatar: user.avatar || null,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("[Register Error]", error);
    return res.status(500).json({
      error: error.message || "Failed to register user",
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { username, email, identifier, password } = req.body;

    // Login can be passed via username, email, or identifier field
    const loginCredential = username || identifier || email;

    if (!loginCredential || !password) {
      return res.status(400).json({
        error: "Please enter your user name and password",
      });
    }

    const trimmedCred = loginCredential.trim();

    // Search by username (case-insensitive) or email
    const user = await User.findOne({
      $or: [
        { username: { $regex: new RegExp(`^${trimmedCred}$`, "i") } },
        { email: trimmedCred.toLowerCase() },
      ],
    });

    if (!user) {
      return res.status(401).json({
        error: "Invalid user name or password",
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid user name or password",
      });
    }

    // If bakeryName was specified in the login form, update it on the user profile
    if (bakeryName && bakeryName.trim()) {
      user.bakeryName = bakeryName.trim();
      await user.save();
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bakeryName: user.bakeryName,
        authProvider: user.authProvider || "local",
        avatar: user.avatar || null,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("[Login Error]", error);
    return res.status(500).json({
      error: error.message || "Failed to log in",
    });
  }
};

// @desc    Authenticate with third-party provider (Google, GitHub, Facebook)
// @route   POST /api/auth/social
// @access  Public
export const socialLogin = async (req, res) => {
  try {
    const {
      provider,
      providerId,
      email,
      name,
      username,
      avatar,
      bakeryName,
      credential,
    } = req.body;

    let targetProvider = (provider || "google").toLowerCase();
    let targetEmail = email ? email.trim().toLowerCase() : null;
    let targetName = name || username || "";
    let targetAvatar = avatar || null;
    let targetProviderId = providerId || null;

    // Decode Google JWT payload if provided via Google Identity Services
    if (credential && !targetEmail) {
      try {
        const payloadBase64 = credential.split(".")[1];
        if (payloadBase64) {
          const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
          const decodedJson = JSON.parse(
            Buffer.from(base64, "base64").toString("utf-8")
          );
          if (decodedJson.email) targetEmail = decodedJson.email.toLowerCase();
          if (decodedJson.name && !targetName) targetName = decodedJson.name;
          if (decodedJson.picture && !targetAvatar) targetAvatar = decodedJson.picture;
          if (decodedJson.sub && !targetProviderId) targetProviderId = decodedJson.sub;
          targetProvider = "google";
        }
      } catch (e) {
        console.warn("[OAuth Token Decode Warning]", e.message);
      }
    }

    if (!targetEmail) {
      return res.status(400).json({
        error: "Email is required for social authentication",
      });
    }

    // Try finding existing user by email or by providerId
    let user = await User.findOne({
      $or: [
        { email: targetEmail },
        ...(targetProviderId
          ? [{ authProvider: targetProvider, providerId: targetProviderId }]
          : []),
      ],
    });

    if (user) {
      let needsSave = false;
      if (!user.providerId && targetProviderId) {
        user.providerId = targetProviderId;
        needsSave = true;
      }
      if (!user.avatar && targetAvatar) {
        user.avatar = targetAvatar;
        needsSave = true;
      }
      if (user.authProvider === "local" && targetProvider !== "local") {
        user.authProvider = targetProvider;
        needsSave = true;
      }
      if (bakeryName && bakeryName.trim() && user.bakeryName === "My Bakery") {
        user.bakeryName = bakeryName.trim();
        needsSave = true;
      }
      if (needsSave) {
        await user.save();
      }
    } else {
      // Build base unique username
      let baseUsername = (targetName || targetEmail.split("@")[0])
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "");

      if (baseUsername.length < 3) {
        baseUsername = `baker_${baseUsername}`.slice(0, 15);
      }

      let candidateUsername = baseUsername;
      let counter = 1;
      while (await User.findOne({ username: candidateUsername })) {
        candidateUsername = `${baseUsername}${counter}`;
        counter += 1;
      }

      user = await User.create({
        username: candidateUsername,
        email: targetEmail,
        authProvider: targetProvider,
        providerId: targetProviderId || `oauth_${Date.now()}`,
        avatar: targetAvatar,
        bakeryName:
          bakeryName?.trim() ||
          `${targetName ? targetName.split(" ")[0] : "Artisan"}'s Bakery`,
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: `Signed in successfully with ${
        targetProvider.charAt(0).toUpperCase() + targetProvider.slice(1)
      }`,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bakeryName: user.bakeryName,
        authProvider: user.authProvider || targetProvider,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("[Social Auth Error]", error);
    return res.status(500).json({
      error: error.message || "Social authentication failed",
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Failed to get user profile",
    });
  }
};
