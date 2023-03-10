import { db, serverTimestamp } from '../helpers/firebase.js'
import { zeaDebug } from '../helpers/zeaDebug.js'

class Session {
  #latestSelectedAnchor

  constructor(id) {
    if (!id) {
      throw new Error('Missing `id` arg.')
    }

    this.id = id
  }

  async init() {
    await this.#observeSession()
  }

  async addPoint(point) {
    if (!this.#latestSelectedAnchor) {
      console.warn(
        "There's no #latestSelectedAnchor. Did you remember to #init the session?"
      )

      return
    }

    const docRef = db.collection('points').doc()
    const { id } = docRef

    const data = {
      id,
      createdAt: serverTimestamp(),
      sessionId: this.id,
      anchor: this.#latestSelectedAnchor,
      string: point,
    }

    await docRef.set(data)

    zeaDebug(
      "Created new point with id '%s' and anchor '%s'",
      id,
      this.#latestSelectedAnchor
    )

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
        `Session not found. Id: "${this.id}". Sessions must be created using the web app.`
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
      },
      (error) => {
        console.log(`Encountered error: ${error}`)
      }
    )
  }
}

export { Session }
