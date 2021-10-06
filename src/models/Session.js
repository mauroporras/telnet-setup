import { randomUUID } from 'crypto'

import { db, serverTimestamp } from '../helpers/firebase.js'
import { zeaDebug } from '../helpers/zeaDebug.js'

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

  async addPoint(point) {
    if (!this.doc) {
      await this.fetchOrCreate()
    }

    const collectionId = 'points'

    const prointId = randomUUID()

    const data = {
      id: prointId,
      createdAt: serverTimestamp(),
      sessionId: this.id,
      anchor: this.latestSelectedAnchor,
      string: point,
    }

    const pointRef = db.collection(collectionId).doc(prointId)
    await pointRef.create(data)

    zeaDebug(
      "Created new point with id '%s' and anchor '%s'",
      prointId,
      this.latestSelectedAnchor
    )

    console.log("anchor selected", this.latestSelectedAnchor)

    return prointId
  }
}

export { Session }
