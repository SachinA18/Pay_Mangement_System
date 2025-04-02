import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyBsJfvXhvRd3Gi6L-U2vd0GRgbmz4_l0Yk",
    authDomain: "pay-mangement-system.firebaseapp.com",
    projectId: "pay-mangement-system", 
    storageBucket: "pay-mangement-system.firebasestorage.app",  
    messagingSenderId: "455370690361",  
    appId: "1:455370690361:web:b2cd103988a4611e6ce2e8"
  };
  
export const app = initializeApp(firebaseConfig);