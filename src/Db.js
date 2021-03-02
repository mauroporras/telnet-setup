import { db } from './helpers/firebase.js'
import { zeaDebug } from './helpers/zeaDebug.js'

class Db {
  constructor() {
    this.collectionId = 'points'
  }

  getCollectionRef() {
    if (!this.collectionRef) {
      this.collectionRef = db.collection(this.collectionId)
    }

    return this.collectionRef
  }

  async addPoint(point) {
    const data = {
      string: point,
    }

    const docRef = await this.getCollectionRef().add(data)
    const { id } = docRef

    zeaDebug(
      "New document added to the '%s' collection with id '%s'",
      this.collectionId,
      id
    )

    return id
  }
}

export { Db }
