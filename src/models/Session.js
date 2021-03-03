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
  }

  async saveOrFetch() {
    const collectionId = 'sessions'

    const docRef = db.collection(collectionId).doc(this.id)
    const doc = await docRef.get()

    if (doc.exists) {
      zeaDebug("Found existing session with id '%s'", this.id)

      this.doc = doc
      return
    }

    const data = {
      createdAt: serverTimestamp(),
      name: this.name,
    }

    await docRef.set(data)

    const createdDoc = await docRef.get()

    this.doc = createdDoc
    this.id = createdDoc.id

    zeaDebug("Created new session with id '%s'", this.id)
  }

  async addPoint(point) {
    if (!this.doc) {
      await this.saveOrFetch()
    }

    const collectionId = 'points'

    const data = {
      createdAt: serverTimestamp(),
      sessionId: this.id,
      string: point,
    }

    const docRef = await db.collection(collectionId).add(data)
    const { id } = docRef

    zeaDebug(
      "New document added to the '%s' collection with id '%s'",
      collectionId,
      id
    )

    return id
  }
}

export { Session }
