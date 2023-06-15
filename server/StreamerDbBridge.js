//import { zeaDebug } from './helpers/zeaDebug.js'
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

    this.session.onCommandCreated((data) => {
      console.log('command created and added to queue')//, data)
      const command = new Command(this.streamer, this.session, data)
      this.commandQueue.addCommand(command)
    })

    this.streamer.on('point', (point) => {
      if(this.commandQueue.isInProgress) return
      console.log('start point', point)
      
      this.session.addPoint(point)
    })
  }
}

export { StreamerDbBridge }
