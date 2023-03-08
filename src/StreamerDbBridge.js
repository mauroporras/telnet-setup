class StreamerDbBridge {
  constructor(streamer, session, collabSession) {
    this.streamer = streamer
    this.session = session
    this.collabSession = collabSession
    
    this.commandQueue = new CommandQueue()
  }

  async start() {
    await this.streamer.connect()
    await this.session.init()
    

    //const res = await this.streamer.send('uptime')

    this.streamer.on('data', (data) => {
      // Ignore points emitted while no Command is running.
      if (this.commandQueue.inProgress) return

      this.session.addPoint(data, this.session.#latestSelectedAnchor)
    })

    // this.collabSession.joinRoom(process.env.ZEA_SESSION_ID)
    // this.collabSession.sub('COMMAND_...', (data)=> {
    //   this.commandQueue.addCommand(new Command(this.streamer, data))
    // })

  }
}

export { StreamerDbBridge }
