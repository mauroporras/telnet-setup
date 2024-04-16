class SessionCollection {
  #collection

  constructor(pocketBase) {
    this.#collection = pocketBase.collection('session')
  }

  async getOne(id) {
    const session = await this.#collection.getOne(id)

    return session
  }

  subscribeToOne(id, callback, options) {
    const unsubscribe = this.#collection.subscribe(id, (e) => {
      if (!options.actions.includes(e.action)) {
        return
      }

      const session = e.record

      callback(session)
    })

    return unsubscribe
  }
}

export { SessionCollection }
