import firebase from 'firebase';

import 'firebase/storage';

var firebaseConfig = {

    apiKey: "AIzaSyDYvZmTVw9j5jpC24iQBudeWZZ4xQnp9Ac",
    authDomain: "react-task-fdd9f.firebaseapp.com",
    projectId: "react-task-fdd9f",
    databaseURL: 'https://react-task-fdd9f-default-rtdb.firebaseio.com/',
    storageBucket: "gs://react-task-fdd9f.appspot.com/",
    messagingSenderId: "992859641178",
    appId: "1:992859641178:web:7607dd8e92775b82688f63"
};

 firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

// export default Fire;
export {
  storage, firebase as default
}
