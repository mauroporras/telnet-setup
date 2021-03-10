import net from 'net'
import Telnet from 'telnet-client'

import { zeaDebug } from './helpers/zeaDebug.js'

import { BaseStreamer } from './BaseStreamer.js'

class TelnetStreamer extends BaseStreamer {
  constructor(params) {
    super()

    this.params = params

    this.#bootstrapTelnetClient()
  }

  async connect() {
    const params = {
      shellPrompt: '',
      ...this.params,
    }

const socket = new net.Socket()
socket.on('error', (err) => console.log(err))
socket.on('data', (data) => {
      const decoded = data.toString('utf8')
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

  #bootstrapTelnetClient() {
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
