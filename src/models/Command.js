import { db } from '../helpers/firebase.js'

const TotalStationErrors = {
  GRC_OK: 0,
  // GRC_NOT_OK:40,
  GRC_PositioningFailed: 41,

  GRC_DIST_ERR: 26,

  // GRC_NOT_OK: 30,
  GRC_ReflectorNotFound: 31,

  GRC_START_FAILED: 50,
  GRC_STREAM_ACITVE: 51,
}

class Command {
  constructor(streamer, session, data) {
    this.streamer = streamer
    this.session = session
    this.data = data
  }

  async invoke() {
    return new Promise(async (resolve) => {
      let result

      const { x, y, z } = this.data.position
      result = await this.streamer.send(`%R8Q,7:1,${x},${y},${z}\r\n`)
      result = await this.streamer.send('%R8Q,1:\r\n')
      result = await this.streamer.send('%R8Q,6:1\r\n')
      result = await this.streamer.send('%R8Q,4:\r\n')

      // Wait for the return code....
      const off = this.streamer.on('data', async (point) => {
        await this.#markAsInvoked()

        // TS0012,410.9147,512.9075,103.3155,10/07/2020,18:53:02.68,16934825
        await this.session.addPoint(point, this.data.anchor)

        result = await this.streamer.send('%R8Q,5:\r\n')

        off()

        resolve()
      })
    })
  }

  async #markAsInvoked() {
    const docRef = db.collection('commands').doc(this.data.id)
    await docRef.update({ isInvoked: true })
  }
}

export { Command, TotalStationErrors }
