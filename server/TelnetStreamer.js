import net from 'net'
import Telnet from 'telnet-client'
import util from 'util'

import { zeaDebug } from './helpers/zeaDebug.js'

import { BaseStreamer } from './BaseStreamer.js'

import find from 'local-devices'

async function getIp() {
  
  //find().then(devices => { console.log('found the IP in the promise', devices)
  
  
  const found =  await find()
  
  //return find().then(devices => {
  console.log('looking for something inside', found)
  
  //return devices})
  return await found
}


// attempting to add messages
  const utf8Encode = new TextEncoder()

  const distanceCmd = '%R8Q,1:'
  const startStreamCmd = '%R8Q,4:'
  console.log('%R8Q,4:', startStreamCmd)
  //var cmd =  utf8Encode.encode(startStreamCmd)
  var cmd2 =  utf8Encode.encode(startStreamCmd)

class TelnetStreamer extends BaseStreamer {
  constructor(params) {
    super()

    this.params = params
    this.ipAddress = ''

    this.bootstrapTelnetClient()
  }

  async connect() {
    const params = {
      shellPrompt: '',
      ...this.params,
    }
    
    

    const socket = new net.Socket()
    
    const foundIt = await getIp()
    try {
      this.params.host = foundIt[0].ip //currently a little risky, grabs the first ip address.
    } catch {
      console.log('IP not found, try again')
    }
    
    console.log('looking for something this.params.host', this.params.host)
    console.log('session streaming')

    socket.on('error', (err) => console.log(err))
    socket.on('data', (data) => {
      const decoded = data.toString('utf8')

      console.log(decoded)
      zeaDebug(decoded)

      this.emit('data', decoded)
      
      
    })
    
    socket.on('ready', (ready) => { // added for sending sommands

      console.log(ready)
      zeaDebug(ready)

      this.emit('ready', cmd2)
      
    })
    
    socket.connect(this.params.port, this.params.host, () => {
      socket.write('%1POWR 1 ')
    })
    
    // try to add a call after inital connection - did not work here
    

    return
    // nothing is reached past this point
    /*
    zeaDebug('TelnetStreamer params:\n%O', params)

    try {
      await this.telnet.connect(params)
    } catch (error) {
      console.info(error)
    }*/
    
    
  }

  async send(data) {
    const sentData = await this.telnet.send(data)
    console.log('telnetstreamer', sentData)
    return sentData
  }
  
  async execute(cmd) {
  // try to add a call after inital connection 
    console.log('telnetstreamer', cmd)
    //const result = await this.telnet.send(cmd)
    //const result = await this.telnet.exec(cmd)
    //console.log('streamer bridge result ', result)
    //this.telnet.exec(cmd, (err, res) => {
     // console.log(err, res)
    //})
  }
  

  bootstrapTelnetClient() {
    this.telnet = new Telnet()

    this.telnet.on('connect', () => {
      zeaDebug('Connected.')
    })

    this.telnet.on('data', (data) => {
      const decoded = data.toString('utf8')
      console.log('starting data', this.telnet)
    
      console.log('starting command in data')
      this.telnet.exec(cmd, (err, res) => {
        console.log(res)
      })
      
      this.emit('data', decoded)
      
      
      
    })

    this.telnet.on('ready', (cmd) => {
      zeaDebug('Ready.')
      
      console.log('starting command', this.telnet)
      this.telnet.exec(cmd, (err, res) => {
        console.log(err, res)
      })
    })

    this.telnet.on('writedone', () => {
      zeaDebug('Writedone.')
    })

    this.telnet.on('timeout', () => {
      zeaDebug('Timeout.')
    })

    this.telnet.on('failedlogin', () => {
      zeaDebug('Failed login.')
    })

    this.telnet.on('error', () => {
      zeaDebug('Error.')
    })

    this.telnet.on('end', () => {
      zeaDebug('End.')
    })

    this.telnet.on('close', () => {
      zeaDebug('Close.')
    })
    
    
  }
}

export { TelnetStreamer }
