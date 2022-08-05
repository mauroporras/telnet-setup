//import  randomUUID  from 'crypto-random-string'
//import  randomUUID  from 'crypto'
//import { randomUUID } from 'crypto-random-string.js'
//const randomUUID = require('crypto-random-string')
import { db, serverTimestamp } from '../helpers/firebase.js'
import { zeaDebug } from '../helpers/zeaDebug.js'

// import {expressServer} from '../StreamBrowser.js'
// import {streamBrowser} from '../../index.js'

class Session {
  #latestSelectedAnchor
  
  constructor(id){
  //constructor(id, name) {
    if (!id) {
      throw new Error('Missing `id` arg.')
    }

    //console.log('session id', id,'hDrHo89VPEpFFqfqFvNI',  db)
    this.id = id
  }
  


  async init() {
    await this.#observeSession()
  }

  async #observeSession() {
    const docRef = db.collection('sessions').doc(this.id)
    const doc = await docRef.get()
    //console.log('db.collection()session /n', db.collection('sessions').doc('hDrHo89VPEpFFqfqFvNI').get())
    
    if (!doc.exists) {
      throw new Error(
      `Session not found. Id: "${this.id}". Session must be created using the web app`
      )
    }

    //const sessionRef = db.collection(collectionId).doc(this.id)
    //const doc = await sessionRef.get()
    
    zeaDebug("Found existing session with id '%s'", this.id)

    //this.unsubscribe = sessionRef.onSnapshot(
    //  (sessionSnapshot) => {
    //    if (!sessionSnapshot.exists) {
    //      return
    //    }
    if (this.unsub) {
      this.unsub()
    }
    
    this.unsub = docRef.onSnapshot(
      (snapshot) => {
        this.#latestSelectedAnchor =
         snapshot.data().latestSelectedAnchor || null
         console.log("this.#latestSelectedAnchor ", this.#latestSelectedAnchor )
       
      },
      (error) => {
        console.log(`Encountered error: ${error}`)
      }
    )
  }
  
  async execute(cmd) {
  // try to add a call after inital connection 
    console.log('session', cmd)
    //const result = await this.telnet.send(cmd)
    //const result = await this.telnet.exec(cmd)
    //console.log('streamer bridge result ', result)
    //this.telnet.exec(cmd, (err, res) => {
     // console.log(err, res)
    //})
  }

  async addPoint(point) {
    //if (!this.doc) {
    //  await this.fetchOrCreate()
    //}
    if (!this.#latestSelectedAnchor) {
      console.warn("there's no #latestSelectedAnchor. did you remember to init the session?")
      

    //const collectionId = 'points'
    }

    //const pointId = await randomUUID(36)
    //console.log (pointId)
    const docRef = db.collection('points').doc()
    const {id} = docRef

    const data = {
    //  id: pointId,
    id,
      createdAt: serverTimestamp(),
      sessionId: this.id,
      anchor: this.#latestSelectedAnchor,
      string: point,
    }
     //console.log(data)

    // expressServer(data)

    //const pointRef = db.collection(collectionId).doc(pointId)
    //await pointRef.create(data)
    
    await docRef.set(data)

    zeaDebug(
      "Created new point with id '%s' and anchor '%s'",
      id,
      this.#latestSelectedAnchor
    )

    //console.log("anchor selected", this.latestSelectedAnchor)

    return id
  }
}

export { Session }
