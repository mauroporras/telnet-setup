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
      negotiationMandatory: false,
      initialCTRLC: true,
      initialLFCR: true,
      timeout: 1500,
      ...this.params,
    }

    zeaDebug('TelnetStreamer params:\n%O', params)

    await this.telnet.connect(params)
  }

  async send(data) {
    return this.telnet.send('uptime')
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
