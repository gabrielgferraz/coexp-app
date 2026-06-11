import { initializeApp } from "firebase/app";
import { 
  getFirestore 
} from "firebase/firestore";

import {
  getAuth
} from "firebase/auth";


const firebaseConfig = {

  apiKey: "AIzaSyDixhXY-7wLrq37TVur2HU_OWWrAmUQaM0",

  authDomain: "coexapp.firebaseapp.com",

  projectId: "coexapp",

  storageBucket: "coexapp.firebasestorage.app",

  messagingSenderId: "1012080538527",

  appId: "1:1012080538527:web:1fc86c8f6d209f50a143aa",

  measurementId: "G-XZQW7PR9XD"

};



const app = initializeApp(firebaseConfig);


export const db = getFirestore(app);

export const auth = getAuth(app);