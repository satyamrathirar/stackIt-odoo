import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAxWM2dTNzPubAh4xz9lM21jdwsP5Qdk6k",
  authDomain: "stackit-48b18.firebaseapp.com",
  projectId: "stackit-48b18",
  storageBucket: "stackit-48b18.firebasestorage.app",
  messagingSenderId: "353338215445",
  appId: "1:353338215445:web:580dadd41148b4c07c121c",
  measurementId: "G-XBEKPCEH54"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app); 