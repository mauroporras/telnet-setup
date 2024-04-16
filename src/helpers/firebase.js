import firebase from 'firebase-admin'
import serviceAccount from '../../firebase_service_account_key.json' assert { type: 'json' }

const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID

if (!GCP_PROJECT_ID) {
  throw Error('Missing "GCP_PROJECT_ID" env var.')
}

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: `https://${GCP_PROJECT_ID}.firebaseio.com`,
})

const db = firebase.firestore()

const { serverTimestamp } = firebase.firestore.FieldValue

export { db, serverTimestamp }
