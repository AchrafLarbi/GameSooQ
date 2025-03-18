import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";

// Register Admin or Super Admin
export const registerAdmin = async (email, password, role) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  const collection = role === "super_admin" ? "super_admins" : "admins";
  await setDoc(doc(db, collection, user.uid), { email, role });

  return { uid: user.uid, email, role };
};

// Login Admin or Super Admin
export const loginAdmin = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  // Check role in Firestore
  let role = null;
  const superAdminDoc = await getDoc(doc(db, "super_admins", user.uid));
  const adminDoc = await getDoc(doc(db, "admins", user.uid));

  if (superAdminDoc.exists()) role = "super_admin";
  else if (adminDoc.exists()) role = "admin";
  else throw new Error("Unauthorized access");

  return { uid: user.uid, email, role };
};

// Logout
export const logoutAdmin = async () => {
  await signOut(auth);
};
