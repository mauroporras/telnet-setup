import net from 'net'
import Telnet from 'telnet-client'

import { zeaDebug } from './helpers/zeaDebug.js'

import { BaseStreamer } from './BaseStreamer.js'

import find from 'local-devices'

async function getIp() {
  
  const found =  await find()
  
  //return find().then(devices => {
  console.log('looking for something inside', found)
  //return devices})
  return await found
}


const outPutText =
  'C:/Box/Active Projects/190153_Cadet_Chapel_Repairs/Engineering/ZSK/ZSK_210712_SurveyLink/211004_MUBC/LogFiles/SurveyLog.txt'

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
    this.params.host = foundIt[0].ip //currently a little risky, grabs the first ip address.
    
    console.log('looking for something', foundIt.ip)
    console.log('looking for something this.params.host', this.params.host)
    console.log('session streaming')

    socket.on('error', (err) => console.log(err))
    socket.on('data', (data) => {
      const decoded = data.toString('utf8')

      console.log(decoded)
      zeaDebug(decoded)

      this.emit('data', decoded)
      
    })
    
    
    socket.connect(this.params.port, this.params.host, () => {
      socket.write('%1POWR 1 ')
    })

    return

    zeaDebug('TelnetStreamer params:\n%O', params)

    try {
      await this.telnet.connect(params)
    } catch (error) {
      console.info(error)
    }
  }

  async send(data) {
    return this.telnet.send(data)
  }

  bootstrapTelnetClient() {
    this.telnet = new Telnet()

    this.telnet.on('connect', () => {
      zeaDebug('Connected.')
    })

    this.telnet.on('data', (data) => {
      const decoded = data.toString('utf8')

      this.emit('data', decoded)
    })

    this.telnet.on('ready', () => {
      zeaDebug('Ready.')
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
