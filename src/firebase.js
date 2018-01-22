import firebase from 'firebase'

const config = {
  apiKey: "AIzaSyCqk057r3DvsKYVQeyj5ZRE0GtGSoUK1Fk",
  authDomain: "cv-zebra.firebaseapp.com",
  databaseURL: "https://cv-zebra.firebaseio.com",
  projectId: "cv-zebra",
  storageBucket: "cv-zebra.appspot.com",
  messagingSenderId: "793220475179"
};

firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default firebase;

