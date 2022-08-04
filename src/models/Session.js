import { db, serverTimestamp } from '../helpers/firebase.js'
import { zeaDebug } from '../helpers/zeaDebug.js'

class Session {
  constructor(id) {
    if (!id) {
      throw new Error('Missing `id` arg.')
    }

    this.id = id
    this.latestSelectedAnchor = null
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
        this.latestSelectedAnchor = snapshot.data().latestSelectedAnchor || null
      },
      (error) => {
        console.log(`Encountered error: ${error}`)
      }
    )
  }

  async addPoint(point) {
    if (!this.latestSelectedAnchor) {
      await this.#observeSession()
    }

    const docRef = db.collection('points').doc()
    const { id } = docRef

    const data = {
      id,
      createdAt: serverTimestamp(),
      sessionId: this.id,
      anchor: this.latestSelectedAnchor,
      string: point,
    }

    await docRef.set(data)

    zeaDebug(
      "Created new point with id '%s' and anchor '%s'",
      id,
      this.latestSelectedAnchor
    )

    return id
  }
}

export { Session }
