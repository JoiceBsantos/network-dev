import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyBcNOZk91T7lz0OwwEhtVh36-7dXf4IuRg",
  authDomain: "networkdev-9350e.firebaseapp.com",
  projectId: "networkdev-9350e",
  storageBucket: "networkdev-9350e.firebasestorage.app",
  messagingSenderId: "706212723967",
  appId: "1:706212723967:web:c50c682ca243c237e660ca"
};

const app = initializeApp(firebaseConfig);

export { app };