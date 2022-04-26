import firebase from 'firebase-admin'

//import serviceAccount from '../../firebase_service_account_key.json' assert { type: 'json' };
import serviceAccount from '../../firebase_service_account_key.json';

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: `https://${process.env.GCP_PROJECT_ID}.firebaseio.com`,
})

const db = firebase.firestore()

const { serverTimestamp } = firebase.firestore.FieldValue

export { db, serverTimestamp }
