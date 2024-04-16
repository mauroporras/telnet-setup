import { db, serverTimestamp } from '../helpers/firebase.js'
import { zeaDebug } from '../helpers/zeaDebug.js'

class Session {
  #latestSelectedAnchor
  #sessionCollection
  #pointCollection

  constructor(id, sessionCollection, pointCollection) {
    if (!id) {
      throw Error('Missing `id` arg.')
    }

    this.id = id

    this.#sessionCollection = sessionCollection
    this.#pointCollection = pointCollection
  }

  async init() {
    await this.#observeSession()
  }

  async addPoint(point, anchor) {
    if (!anchor && !this.#latestSelectedAnchor) {
      throw Error(
        'Missing `anchor` and `latestSelectedAnchor`. Did you remember to #init the session?'
      )
    }

    const theAnchor = anchor || this.#latestSelectedAnchor

    const data = {
      sessionId: this.id,
      anchor: theAnchor,
      string: point,
    }

    const createdPoint = await this.#pointCollection.create(data)

    zeaDebug("Created point with ID '%s' and anchor '%s'", id, theAnchor)

    const { id } = createdPoint

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
        if (change.type !== 'added') {
          return
        }

        callback(change.doc.data())
      })
    })

    return unsub
  }

  async #observeSession() {
    const session = await this.#sessionCollection.getOne(this.id)

    zeaDebug('Found existing session "%s"', this.id)

    this.#latestSelectedAnchor = session.latestSelectedAnchor || null

    this.unsub?.()

    this.unsub = this.#sessionCollection.subscribeToOne(
      this.id,
      (session) => {
        this.#latestSelectedAnchor = session.latestSelectedAnchor || null
      },
      { actions: ['update'] }
    )
  }
}

export { Session }
