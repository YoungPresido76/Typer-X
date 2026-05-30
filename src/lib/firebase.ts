import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCE3-SE30KY9Gdidlc0OWUSvu5JZcFhRiM",
  authDomain: "typer-x.firebaseapp.com",
  projectId: "typer-x",
  storageBucket: "typer-x.firebasestorage.app",
  messagingSenderId: "315114105787",
  appId: "1:315114105787:web:f89a6f79501b4e7b01729e"
};

export const app      = initializeApp(firebaseConfig);
export const auth     = getAuth(app);
export const db       = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
