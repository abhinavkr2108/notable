// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "notable-f8069.firebaseapp.com",
  projectId: "notable-f8069",
  storageBucket: "notable-f8069.appspot.com",
  messagingSenderId: "591376518532",
  appId: "1:591376518532:web:351194e695f4168e2661d1",
  measurementId: "G-DPMTEPQ44K",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export async function uploadFileToFirebase(imageUrl: string, name: string) {
  try {
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    const fileName = name.replace(" ", "-") + Date.now() + ".jpeg";
    const storageRef = ref(storage, `images/${fileName}`);
    await uploadBytes(storageRef, buffer, {
      contentType: "image/jpeg",
    });
    const firebaseUrl = await getDownloadURL(storageRef);
    return firebaseUrl;
  } catch (error) {
    console.error(error);
  }
}
