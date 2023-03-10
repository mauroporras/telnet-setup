import { CommandQueue } from './helpers/CommandQueue.js'
import { Command } from './models/Command.js'

class StreamerDbBridge {
  constructor(streamer, session) {
    this.streamer = streamer
    this.session = session
    this.commandQueue = new CommandQueue()
  }

  async start() {
    await this.streamer.connect()
    await this.session.init()

    //const res = await this.streamer.send('uptime')

    this.session.onCommandCreated((data) => {
      const command = new Command(this.streamer, this.session, data)
      this.commandQueue.addCommand(command)
    })

    this.streamer.on('data', (data) => {
      this.session.addPoint(data)
    })
  }
}

export { StreamerDbBridge }
