import { db } from "./firebase";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { app } from "./firebase"; // Make sure your firebase.ts exports 'app'

export const auth = getAuth(app);

export const login = (email: string, pass: string) => 
  signInWithEmailAndPassword(auth, email, pass);

export const logout = () => signOut(auth);