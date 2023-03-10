import net from 'net'
import Telnet from 'telnet-client'

import { zeaDebug } from './helpers/zeaDebug.js'

import { BaseStreamer } from './BaseStreamer.js'

const outPutText =
  'C:/Box/Active Projects/190153_Cadet_Chapel_Repairs/Engineering/ZSK/ZSK_210712_SurveyLink/211004_MUBC/LogFiles/SurveyLog.txt'

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

      zeaDebug('Socket decoded data:', decoded)

      this.emit('data', decoded)

      // try {
      //   if (fs.access(outPutText)) {
      //     fs.appendFile(outPutText, data, (err) => {
      //       if (err) throw err;
      //     })
      //   } else {
      //     fs.writeFile(outPutText, data, (err) => {
      //       if (err) throw err;
      //     })
      //   }
      // } catch(err) {
      //   console.error(err)
      // }
    })

    socket.connect(this.params.port, this.params.host, () => {
      socket.write('%1POWR 1 ')
    })

    zeaDebug('TelnetStreamer params:\n%O', params)

    try {
      await this.telnet.connect(params)
    } catch (error) {
      console.error(error)
    }
  }

  async send(data) {
    return this.telnet.send(data)
  }

  #bootstrapTelnetClient() {
    this.telnet = new Telnet()

    this.telnet.on('connect', () => {
      zeaDebug('Telnet connected.')
    })

    this.telnet.on('data', (data) => {
      zeaDebug('Telnet data:', data)

      const decoded = data.toString('utf8')

      // try {
      //   if (fs.access(outPutText)) {
      //     fs.appendFile(outPutText, decoded, (err) => {
      //       if (err) throw err
      //     })
      //   } else {
      //     fs.writeFile(outPutText, decoded, (err) => {
      //       if (err) throw err
      //     })
      //   }
      // } catch (err) {
      //   console.error(err)
      // }

      this.emit('data', decoded)
    })

    this.telnet.on('ready', () => {
      zeaDebug('Telnet ready.')
    })

    this.telnet.on('writedone', () => {
      zeaDebug('Telnet writedone.')
    })

    this.telnet.on('timeout', () => {
      zeaDebug('Telnet timeout.')
    })

    this.telnet.on('failedlogin', () => {
      zeaDebug('Telnet failed login.')
    })

    this.telnet.on('error', () => {
      zeaDebug('Telnet error.')
    })

    this.telnet.on('end', () => {
      zeaDebug('Telnet end.')
    })

    this.telnet.on('close', () => {
      zeaDebug('Telnet close.')
    })
  }
}

export { TelnetStreamer }
