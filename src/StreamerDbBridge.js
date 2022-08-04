class StreamerDbBridge {
  constructor(streamer, session) {
    this.streamer = streamer
    this.session = session
  }

  async start() {
    await this.streamer.connect()
    await this.session.init()

    //const res = await this.streamer.send('uptime')

    this.streamer.on('data', (data) => {
      this.session.addPoint(data)
    })
  }
}

export { StreamerDbBridge }
