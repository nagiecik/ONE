import * as firebase from "firebase";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB93rMM_xjJx2ugE0FymQzS1-XunCCf510",
  authDomain: "React-Native.firebaseapp.com",
  databaseURL: "https://React-Native.firebaseio.com",
  storageBucket: "React-Native.appspot.com",
};

firebase.initializeApp(firebaseConfig);

export default firebase;
