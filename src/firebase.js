import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAI, GoogleAIBackend } from "firebase/ai";

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
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Firebase AI Logic (Gemini via Google AI backend — free tier)
export let ai = null;
try {
  ai = getAI(app, { backend: new GoogleAIBackend() });
} catch (err) {
  console.error("Failed to initialize Firebase AI Logic:", err);
}

export default app;
