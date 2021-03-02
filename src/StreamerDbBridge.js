import { zeaDebug } from './helpers/zeaDebug.js'

class StreamerDbBridge {
  constructor(streamer, db) {
    this.streamer = streamer
    this.db = db
  }

  async start() {
    await this.streamer.connect()

    const res = await this.streamer.send('uptime')

    this.streamer.on('data', (data) => {
      this.db.addPoint(data)
    })
  }
}

export { StreamerDbBridge }
