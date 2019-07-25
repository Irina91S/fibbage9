import firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyArJvuM9ClAN-fUW74Bcelo6mGZdosiAZQ',
  authDomain: 'fibbage2.firebaseapp.com',
  databaseURL: 'https://fibbage2.firebaseio.com',
  projectId: 'fibbage2',
  storageBucket: 'fibbage2.appspot.com',
  messagingSenderId: '529443257048',
  appId: '1:529443257048:web:1d9287fc6836df0f'
};

firebase.initializeApp(config);

export default firebase;

export const database = firebase.database();
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
