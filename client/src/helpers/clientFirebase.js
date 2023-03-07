// import firebase from 'firebase-admin'
// import firebase from 'firebase/app'
// import firebase from 'firebase/app';
// import 'firebase/auth';
// import firebase from 'c:/Users/nbarnes/Documents/GitHub/telnet-setup/node_modules/firebase-admin/lib/index.js'
// import firebase from 'c:/Users/nbarnes/Documents/GitHub/telnet-setup/node_modules/firebase-admin'
import { initializeApp } from 'firebase/app';
import { getFirestore} from 'firebase/firestore/lite';
// import firebase from 'firebase/compat/app';
// import firebase from 'firebase/app';
// import 'firebase/firestore';
import { collection, getDocs } from "firebase/firestore"; 

// import serviceAccount from './firebase_service_account_key.json' //assert { type: 'json' }
//import serviceAccount from '../../firebase_service_account_key.json';


const firebaseConfig = {
  apiKey: "AIzaSyCwm0Nex3W_jTBFZWAofXH7r4mTa3bdosw",
  authDomain: "zahner-production-8e2af.firebaseapp.com",
  projectId: "zahner-production-8e2af",
  storageBucket: "zahner-production-8e2af.appspot.com",
  messagingSenderId: "379521829525",
  appId: "1:379521829525:web:ca6517410571680ab6299c",
  measurementId: "G-7X3BB5E4MG"
};




const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// const db = app.firestore();
// firebase.initializeApp(firebaseConfig);
// const db = firebase.firestore();

console.log("check db ", db);
// db.collection('sessions').get().then((querySnapshot) => {console.log(querySnapshot.data())});

// const querySnapshot = await getDocs(collection(db, "session"));
//     querySnapshot.forEach((doc) => {
//       const docs = []
//       docs.push({ id: doc.id, ...doc.data() })
//       console.log(`${doc.id} => ${doc.data()}`);
//   });

// async function  getSessions() {
//   const querySnapshot = await getDocs(collection(db, "session"));
//     querySnapshot.forEach((doc) => {
//       const docs = []
//       docs.push({ id: doc.id, ...doc.data() })
//       console.log(`${doc.id} => ${doc.data()}`);
//       return docs;}
  
//   );
  
// }
// const querySnapshot = await getDocs(collection(db, "session"));
//     querySnapshot.forEach((doc) => {
//       const docs = []
//       docs.push({ id: doc.id, ...doc.data() })
//       console.log(`${doc.id} => ${doc.data()}`);
//       return docs;}
  
//   );

// getDocs(collection(db, "sessions"))
// .then((querySnapshot) => {
//   const docs = []
//   querySnapshot.forEach((doc) => {
//     docs.push({ id: doc.id, ...doc.data() })
//     console.log(`${doc.id} => ${doc.data()}`);
//   })
//   setDocuments(docs)
// })

export { db }
