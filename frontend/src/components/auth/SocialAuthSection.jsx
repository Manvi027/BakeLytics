import { useState, useEffect, useRef } from "react";
import { AlertCircle, KeyRound } from "lucide-react";
import { socialLoginUser } from "../../services/authService";

// Authentic Multi-Color Google SVG Icon
export function GoogleIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

// Authentic GitHub SVG Icon
export function GitHubIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

// Authentic Facebook SVG Icon
export function FacebookIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export default function SocialAuthSection({
  onSuccess,
  defaultBakeryName = "",
}) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const googleBtnRef = useRef(null);

  const clientId =
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    "157874920195-irppj9oj5fk5hnppn2pent5rclklrqh8.apps.googleusercontent.com";

  // Handle Google OAuth Credential response from Google Identity Services
  const handleGoogleCredentialResponse = async (response) => {
    if (!response || !response.credential) {
      setErrorMessage("Google did not return credentials. Please try again.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const result = await socialLoginUser({
        provider: "google",
        credential: response.credential,
        bakeryName: defaultBakeryName || "My Bakery",
      });

      if (onSuccess) {
        onSuccess(result?.user);
      }
    } catch (err) {
      console.error("Google sign-in error:", err);
      setErrorMessage(
        err.message || "Failed to sign in with Google. Please check your network and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Initialize Google Identity Services
  useEffect(() => {
    let intervalId = null;

    const setupGoogle = () => {
      if (window.google?.accounts?.id && clientId) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          // Optional: Render hidden Google button for native prompt fallback
          if (googleBtnRef.current) {
            window.google.accounts.id.renderButton(googleBtnRef.current, {
              theme: "outline",
              size: "large",
              type: "standard",
              shape: "rectangular",
              text: "continue_with",
              width: 320,
            });
          }
        } catch (e) {
          console.warn("Error initializing Google Identity Services:", e);
        }
        return true;
      }
      return false;
    };

    if (!setupGoogle()) {
      intervalId = setInterval(() => {
        if (setupGoogle()) {
          clearInterval(intervalId);
        }
      }, 300);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [clientId, defaultBakeryName]);

  // Trigger Google Sign-In prompt
  const handleGoogleClick = () => {
    setErrorMessage("");

    if (window.google?.accounts?.id) {
      // Trigger Google Identity Services prompt (shows native logged-in accounts)
      window.google.accounts.id.prompt((notification) => {
        if (
          notification.isNotDisplayed() ||
          notification.isSkippedMoment()
        ) {
          // If prompt was dismissed or not displayed, simulate click on the rendered button
          const nativeBtn = googleBtnRef.current?.querySelector("div[role=button]");
          if (nativeBtn) {
            nativeBtn.click();
          } else {
            console.info("Google prompt status:", notification.getNotDisplayedReason?.());
          }
        }
      });

      // Also trigger button click immediately if available for smooth experience
      const nativeBtn = googleBtnRef.current?.querySelector("div[role=button]");
      if (nativeBtn) {
        nativeBtn.click();
      }
    } else {
      setErrorMessage(
        "Google Sign-In is still loading. Please make sure you have internet access and try again."
      );
    }
  };

  return (
    <div className="w-full">
      {/* Hidden container where GIS renders the official Google button */}
      <div ref={googleBtnRef} className="hidden" aria-hidden="true" />

      {/* Divider */}
      <div className="relative my-6 flex items-center justify-center">
        <div className="w-full border-t border-[#ebd8c4]" />
        <span className="absolute bg-white px-3.5 text-xs font-medium uppercase tracking-wider text-[#937b6a]">
          Or continue with
        </span>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="mb-3 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
          <AlertCircle size={15} className="shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Primary Google 1-Click Button */}
      <button
        type="button"
        id="btn-google-auth"
        onClick={handleGoogleClick}
        disabled={loading}
        className="group relative flex w-full items-center justify-center gap-3 rounded-xl border border-[#d8c3b0] bg-white px-4 py-3 text-sm font-semibold text-[#3b2416] shadow-xs transition-all duration-200 hover:border-[#4285F4] hover:bg-[#fffcf7] hover:shadow-md active:scale-[0.99] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#4285F4] border-t-transparent" />
        ) : (
          <GoogleIcon className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
        )}
        <span className="font-medium text-[#2d1b0f]">
          {loading ? "Connecting to Google..." : "Continue with Google"}
        </span>
        <span className="ml-auto flex items-center gap-1 rounded-full bg-[#e8f0fe] px-2 py-0.5 text-[10px] font-semibold text-[#1a73e8]">
          <KeyRound size={10} /> 1-Click
        </span>
      </button>

      {/* Secondary GitHub & Facebook Options */}
      <div className="mt-3 grid grid-cols-2 gap-3">
        <button
          type="button"
          id="btn-github-auth"
          onClick={() => {
            setErrorMessage("GitHub OAuth integration can be linked in settings.");
          }}
          className="group flex items-center justify-center gap-2 rounded-xl border border-[#d8c3b0] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#24292f] shadow-xs transition-all duration-200 hover:border-[#24292f] hover:bg-[#24292f] hover:text-white cursor-pointer"
        >
          <GitHubIcon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
          <span>GitHub</span>
        </button>

        <button
          type="button"
          id="btn-facebook-auth"
          onClick={() => {
            setErrorMessage("Facebook OAuth integration can be linked in settings.");
          }}
          className="group flex items-center justify-center gap-2 rounded-xl border border-[#d8c3b0] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#1877f2] shadow-xs transition-all duration-200 hover:border-[#1877f2] hover:bg-[#1877f2] hover:text-white cursor-pointer"
        >
          <FacebookIcon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
          <span>Facebook</span>
        </button>
      </div>

    </div>
  );
}
