class PointCollection {
  #collection

  constructor(pocketBase) {
    this.#collection = pocketBase.collection('point')
  }

  async create(newDoc) {
    const created = await this.#collection.create(newDoc)

    return created
  }
}

export { PointCollection }
