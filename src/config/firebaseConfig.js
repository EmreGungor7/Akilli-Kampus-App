// src/config/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase bilgileri
const firebaseConfig = {
  apiKey: "AIzaSyB3oTHjlVabCGt7YzwR2VwQqN_hJ1JEdbI",
  authDomain: "akillikampus-25.firebaseapp.com",
  projectId: "akillikampus-25",
  storageBucket: "akillikampus-25.firebasestorage.app",
  messagingSenderId: "622390549074",
  appId: "1:622390549074:web:86dea5348c7808a2339d8b",
  measurementId: "G-YV3JRVHSRV"
};

// Uygulamayı başlat
const app = initializeApp(firebaseConfig);

// Diğer dosyalarda kullanmak için Auth ve Veritabanını dışarı aktarıyoruz
export const auth = getAuth(app);
export const db = getFirestore(app);