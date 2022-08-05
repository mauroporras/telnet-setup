import  randomUUID  from 'crypto-random-string'
//import  randomUUID  from 'crypto'
//import { randomUUID } from 'crypto-random-string.js'
//const randomUUID = require('crypto-random-string')
import { db, serverTimestamp } from '../helpers/firebase.js'
import { zeaDebug } from '../helpers/zeaDebug.js'

// import {expressServer} from '../StreamBrowser.js'
// import {streamBrowser} from '../../index.js'

class Session {
  constructor(id, name) {
    if (!id) {
      throw new Error('Missing `id` arg.')
    }

    if (!name) {
      throw new Error('Missing `name` arg.')
    }

    this.id = id
    this.name = name
    this.latestSelectedAnchor = null
  }

  async fetchOrCreate() {
    const collectionId = 'sessions'

    const sessionRef = db.collection(collectionId).doc(this.id)
    const doc = await sessionRef.get()

    this.unsubscribe = sessionRef.onSnapshot(
      (sessionSnapshot) => {
        if (!sessionSnapshot.exists) {
          return
        }

        this.latestSelectedAnchor =
          sessionSnapshot.data().latestSelectedAnchor || null
      },
      (error) => {
        console.log(`Encountered error: ${error}`)
      }
    )

    if (doc.exists) {
      zeaDebug("Found existing session with id '%s'", this.id)

      // Clear the latest selected anchor, so a new one can be selected.
      await sessionRef.update({ latestSelectedAnchor: null })

      this.doc = doc
      return
    }

    const data = {
      createdAt: serverTimestamp(),
      name: this.name,
    }

    await sessionRef.set(data)

    const createdDoc = await sessionRef.get()

    this.doc = createdDoc
    this.id = createdDoc.id

    zeaDebug("Created new session with id '%s'", this.id)
  }

  unsubscribe() {
    if (!this.unsubscribe) {
      return
    }

    this.unsubscribe()
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
    if (!this.doc) {
      await this.fetchOrCreate()
    }

    const collectionId = 'points'

    const pointId = await randomUUID(36)
    //console.log (pointId)

    const data = {
      id: pointId,
      createdAt: serverTimestamp(),
      sessionId: this.id,
      anchor: this.latestSelectedAnchor,
      string: point,
    }
     //console.log(data)

    // expressServer(data)

    const pointRef = db.collection(collectionId).doc(pointId)
    await pointRef.create(data)

    zeaDebug(
      "Created new point with id '%s' and anchor '%s'",
      pointId,
      this.latestSelectedAnchor
    )

    //console.log("anchor selected", this.latestSelectedAnchor)

    return pointId
  }
}

export { Session }
