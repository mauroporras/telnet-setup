//import  randomUUID  from 'crypto-random-string'
//import  randomUUID  from 'crypto'
//import { randomUUID } from 'crypto-random-string.js'
//const randomUUID = require('crypto-random-string')
// import { db, serverTimestamp } from '../helpers/firebase.js'
// import { zeaDebug } from '../helpers/zeaDebug.js'

// import {expressServer} from '../StreamBrowser.js'
// import {streamBrowser} from '../../index.js'

import { initializeApp } from 'firebase/app';
// import { getFirestore} from 'firebase/firestore/lite';
// import firebase from 'firebase/compat/app';
// import firebase from 'firebase/app';
// import 'firebase/firestore';
import { collection, getDocs, getFirestore, orderBy, query } from "firebase/firestore"; 

// import serviceAccount from './firebase_service_account_key.json' //assert { type: 'json' }
//import serviceAccount from '../../firebase_service_account_key.json';




class ClientSession {
  
  constructor(){

    console.log("ClientSession constructor")
    this.name = 'Polygon';
    
  }
  

  async init() {
    await this.observeSession()
    return this.dbSessions;
  }

  // async #observeSession() {
  async observeSession() {

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

    console.log("db", db)

    // const querySnapshot = await getDocs(collection(db, "sessions"));
    // const dbGrab = await getDocs(collection(db, "sessions"));
    // const querySnapshot = query(dbGrab, orderBy("name", "desc"));
    const dbGrab = await query(collection(db, "sessions"), orderBy("name", "desc"));
    const querySnapshot = await getDocs(dbGrab);

    const docs = []
     querySnapshot.forEach((doc) => {
      
      docs.push({ id: doc.id, ...doc.data() });
      // console.log(`${doc.id} => ${doc.data()}`);
      // this.#dbSessions = docs;
      this.dbSessions =  docs;
    });

    
    
  }
  

  
}

export { ClientSession }
