// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut } from 'firebase/auth';
import { getDatabase, ref, set, get, onValue, remove, update } from 'firebase/database';


const firebaseConfig = {
  apiKey: "AIzaSyD7e_TnjfRCOYwrHw43xnsTBwLTAV6zYGY",
  authDomain: "video-call-861be.firebaseapp.com",
  projectId: "video-call-861be",
  databaseURL: "https://video-call-861be-default-rtdb.firebaseio.com",
  storageBucket: "video-call-861be.appspot.com",
  messagingSenderId: "182923159890",
  appId: "1:182923159890:web:8482553285bb199d33728b"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const database = getDatabase(app);

const provider = new GoogleAuthProvider();

const signInWithGoogle = () => {
  signInWithPopup(auth, provider);
};

const signOut = () => {
  firebaseSignOut(auth);
};

export { auth, database, ref, set, get, onValue, remove, update, signInWithGoogle, signOut };