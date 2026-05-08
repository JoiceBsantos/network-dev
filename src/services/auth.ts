import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  signOut,
} from 'firebase/auth';

import { app } from '../config/firebase';

const auth = getAuth(app);

export async function register(email: string, password: string) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  return userCredential.user;
}

export async function login(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return userCredential.user;
}

export async function logout() {
  await signOut(auth);
}

export async function getToken() {
  const user = auth.currentUser;

  if (!user) {
    return null;
  }

  return await user.getIdToken();
}