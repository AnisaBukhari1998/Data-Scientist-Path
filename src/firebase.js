import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAI, GoogleAIBackend } from "firebase/ai";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: "AIzaSyCT0YG1Cuup0ZSE59C_bTxOAfuwPuXYCRA",
  authDomain: "data-sci-path-v2-543.firebaseapp.com",
  projectId: "data-sci-path-v2-543",
  storageBucket: "data-sci-path-v2-543.firebasestorage.app",
  messagingSenderId: "964205692853",
  appId: "1:964205692853:web:2290d0f28a34177d2efbfc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// App Check: proves requests come from this app (not someone copying the config above),
// so other people can't spend the Gemini quota. The reCAPTCHA Enterprise site key is
// public; it is read from VITE_RECAPTCHA_SITE_KEY (see .env.example).
// During `npm run dev`, a debug token is printed in the browser console instead; register
// it once in the Firebase console (App Check > Apps > Manage debug tokens).
const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
if (import.meta.env.DEV) {
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = import.meta.env.VITE_APPCHECK_DEBUG_TOKEN || true;
}
export let appCheck = null;
if (recaptchaSiteKey || import.meta.env.DEV) {
  try {
    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(recaptchaSiteKey || 'debug-only'),
      isTokenAutoRefreshEnabled: true,
    });
  } catch (err) {
    console.error("Failed to initialize App Check:", err);
  }
} else {
  console.warn("App Check is off: set VITE_RECAPTCHA_SITE_KEY before building for production.");
}
export const auth = getAuth(app);
export const db = getFirestore(app);

// For local testing only: `VITE_USE_EMULATORS=true npm run dev` talks to the Firebase
// emulators on this computer (fake sign-in and database) instead of the real project.
if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATORS === 'true') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
}

// Initialize Firebase AI Logic (Gemini via Google AI backend — free tier)
export let ai = null;
try {
  // Limited-use tokens are single-use, which makes replaying a captured request harder.
  ai = getAI(app, { backend: new GoogleAIBackend(), useLimitedUseAppCheckTokens: true });
} catch (err) {
  console.error("Failed to initialize Firebase AI Logic:", err);
}

export default app;
