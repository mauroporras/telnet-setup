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
      this.streamer.socket.setTimeout(60000);
      console.log('setTimeout streamer object')

      const command = new Command(this.streamer, this.session, data)
      this.commandQueue.addCommand(command)
      console.log('\n','command created and added to queue for anchor: ', data.anchor, '\n')//, data)
    })

    this.streamer.on('point', (point) => {
      if(this.commandQueue.isInProgress) return
      console.log('start point', point)
      
      this.session.addPoint(point)
    })

    this.streamer.once('reset', () => {
      console.log('--------------------------------restarting...--------------------------------')
      setTimeout(() => {
      // console.log('this.params.port, this.params.host', this.params.port, this.params.host)
      // console.log('this.streamer', this.commandQueue)
      this.commandQueue.clearCommandQueue()
      // console.log('this.streamer after', this.commandQueue)
      this.streamer.socket.end()
      this.streamer.socket.destroy()
      
      this.start()
      console.log('session reset', this)
      }, 2000)
    })

    this.streamer.socket.once('timeout', () => {
      // this.socket.setTimeout(60000); //https://nodejs.org/api/net.html#net_socket_settimeout_timeout_callback
      console.log('socket timeout')
      //try to reconnect
      console.log('--------------------------------Reconnecting...--------------------------------')
      // console.log('this.params.port, this.params.host', this.params.port, this.params.host)
      // console.log('this.streamer', this.commandQueue)
      this.commandQueue.clearCommandQueue()
      // console.log('this.streamer after', this.commandQueue)
      this.streamer.socket.end()
      this.streamer.socket.destroy()
      
      this.start()
      }, 45000)
      console.log('socket timeout end', this)
    // })
  }
}

export { StreamerDbBridge }
