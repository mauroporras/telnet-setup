import { zeaDebug } from './helpers/zeaDebug.js'

// attempting to add messages
  /*const utf8Encode = new TextEncoder()

  const distanceCmd = '%R8Q,1:'
  const startStreamCmd = '%R8Q,4:'
  console.log('%R8Q,4:', startStreamCmd)
  var cmd2 =  utf8Encode.encode(distanceCmd)*/

class StreamerDbBridge {
  constructor(streamer, session) {
    this.streamer = streamer
    this.session = session
  }

  async start() {
    await this.streamer.connect()
    
    //const res = await this.streamer.send('uptime')
    //const res = await this.streamer.send('uptime')
    //console.log('streamer bridge this.streamer.connect()', this.streamer)
    
    this.streamer.on('data', (data) => {
      this.session.addPoint(data)
      return data
    })
    
    this.streamer.on('ready', (cmd2) => {
      const utf8Encode = new TextEncoder()

      const distanceCmd = '%R8Q,1:'
      const startStreamCmd = '%R8Q,4:'
      console.log('%R8Q,4:', startStreamCmd)
      var cmd2 =  utf8Encode.encode(startStreamCmd)
      this.streamer.send(cmd2)
      console.log('executing strembridge', this)
      //this.streamer.telnet.exec(cmd2, (err, res) => {
      //  console.log('executing', err, res)
      //})
    })
    

  }
  
  //adding to attempt to send data back
  async send(cmd) {
    //await this.streamer.connect()
    console.log('streamer bridge ', cmd)
    //console.log('streamer bridge this.streamer', this.streamer)
    
    //const res = await this.streamer.on('connect')
    
    //console.log('streamer bridge res', res)
    //await this.streamer.execute(cmd)
    //const result = await this.streamer.execute(cmd)
    //console.log('streamer bridge result ', result)
    //const res = await this.streamer.send('uptime')

    
    //attempt signal
    /*this.streamer.on('ready', (cmd) => {
      console.log('this on')
      this.streamer.exec(cmd, (err, res) => {
        console.log(res)
      })
      
    })*/
  }
}

export { StreamerDbBridge }
