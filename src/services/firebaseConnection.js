import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'


const firebaseConfig = {
  apiKey: "AIzaSyCa0jFiEXMcVVGOi3JTQ1J7e1735j3SZlw",
  authDomain: "dpessoal-157dc.firebaseapp.com",
  projectId: "dpessoal-157dc",
  storageBucket: "dpessoal-157dc.appspot.com",
  messagingSenderId: "669255503864",
  appId: "1:669255503864:web:f9fd049522f165f711500d"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp)
const db = getFirestore(firebaseApp)
const storage = getStorage(firebaseApp)

export {auth, db, storage};