// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAzd6ShxDkmWzKpqzVISr0rme8QB8t2Clo',
  authDomain: 'metamodelui.firebaseapp.com',
  projectId: 'metamodelui',
  storageBucket: 'metamodelui.appspot.com',
  messagingSenderId: '528744965095',
  appId: '1:528744965095:web:30a0922e4b65067e881342',
  measurementId: 'G-012X8EJ8YE',
};
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
