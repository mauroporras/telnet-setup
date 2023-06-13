
import { db, serverTimestamp } from '../helpers/firebase.js'
import { zeaDebug } from '../helpers/zeaDebug.js'


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

  async addPoint(point, anchor) {
    if (!anchor && !this.#latestSelectedAnchor) {
      console.warn(
        'Missing `anchor` and `latestSelectedAnchor`. Did you remember to #init the session?'
      )

      return
    }
    // console.log('anchor || this.#latestSelectedAnchor', anchor, this.#latestSelectedAnchor)
    console.log('anchor selected : ', anchor)
    const theAnchor = anchor || this.#latestSelectedAnchor // Isues: this.#latestSelectedAnchor is holding onto previouw anchor


    const docRef = db.collection('points').doc()
    const { id } = docRef

    const data = {
      id,
      createdAt: serverTimestamp(),
      sessionId: this.id,
      anchor: theAnchor,
      string: point,
    }
    // console.log('data :', data)
    await docRef.set(data)

    zeaDebug("Created new point with id '%s' and anchor '%s'", id, theAnchor)

    return id
  }

  onCommandCreated(callback) {
    const query = db
      .collection('commands')
      .where('sessionId', '==', this.id)
      .where('isInvoked', '==', false)
      .orderBy('createdAt')

    const unsub = query.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          callback(change.doc.data())
        }
      })
    })

    return unsub
  }



  async #observeSession() {
    const docRef = db.collection('sessions').doc(this.id)
    const doc = await docRef.get()
    
    if (!doc.exists) {
      throw new Error(
      `Session not found. Id: "${this.id}". Session must be created using the web app`
      )
    }

    
    zeaDebug("Found existing session with id '%s'", this.id)

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
  
}

export { Session }
