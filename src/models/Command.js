import { db } from '../helpers/firebase.js'

const TotalStationCommands = {
  turnTelescope: (x, y, z) => `%R8Q,7:1,${x},${y},${z}\r\n`,
  START_STREAM: '%R8Q,4:\r\n',
  SAMPLE_DIST: '%R8Q,1:\r\n',
  SEARCH: '%R8Q,6:1\r\n',
  STOP_STREAM: '%R8Q,5:\r\n',
}

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
    const { x, y, z } = this.data.position

    this.streamer.send(TotalStationCommands.turnTelescope(x, y, z))
    this.streamer.send(TotalStationCommands.START_STREAM)
    this.streamer.send(TotalStationCommands.SAMPLE_DIST)
    this.streamer.send(TotalStationCommands.SEARCH)

    return new Promise(async (resolve) => {
      const off = this.streamer.on('data', async (point) => {
        off()

        this.streamer.send(TotalStationCommands.STOP_STREAM)

        await this.#markAsInvoked()

        // TS0012,410.9147,512.9075,103.3155,10/07/2020,18:53:02.68,16934825
        await this.session.addPoint(point, this.data.anchor)

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
