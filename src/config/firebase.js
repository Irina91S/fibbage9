import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyAyhJbLtU1xeAmQfpu-8mH0vzP9u9yjgq0",
  authDomain: "fibbage-31361.firebaseapp.com",
  databaseURL: "https://fibbage-31361.firebaseio.com",
  projectId: "fibbage-31361",
  storageBucket: "fibbage-31361.appspot.com",
  messagingSenderId: "431881259194",
  appId: "1:431881259194:web:42ccd03f89329b6b"
};

firebase.initializeApp(config);

export default firebase;

export const database = firebase.database();
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
