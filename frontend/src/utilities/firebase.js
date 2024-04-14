// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase,  ref, set, onValue, remove  } from "firebase/database";
import { useState, useEffect } from "react";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBeItviy1UK0C8ti9Pz0zsEPav8eX7HglE",
  authDomain: "chicagocrimeanalysis-a24e2.firebaseapp.com",
  databaseURL: "https://chicagocrimeanalysis-a24e2-default-rtdb.firebaseio.com",
  projectId: "chicagocrimeanalysis-a24e2",
  storageBucket: "chicagocrimeanalysis-a24e2.appspot.com",
  messagingSenderId: "171593647233",
  appId: "1:171593647233:web:f7f3170ce79f174333b980"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// read data
export const useData = (path) => {
    const [data, setData] = useState();
    const [error, setError] = useState(null);
  
    useEffect(() => (
        onValue(ref(database, path), (snapshot) =>{
            setData(snapshot.val());
        }
      , (error) => {
        setError(error);
      })
    ), [ path ]);
  
    return [ data, error ];
  };

// Set Data
export const setData = (path, value) =>{
    set(ref(database, path), value)
} 

//removeData
export const removeData = (path) =>{
    remove(ref(database, path));
}