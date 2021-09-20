import net from 'net'
import Telnet from 'telnet-client'

import { zeaDebug } from './helpers/zeaDebug.js'

import { BaseStreamer } from './BaseStreamer.js'

import processName from './helpers/nameSwap.js'

import fs  from 'fs'

const outPutText = process.env.file_output

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
      console.log(decoded)
      //Adjust name
      const nameAdj = processName(decoded)
      console.log(nameAdj)

      fs.appendFile(outPutText, nameAdj, (err) => {
        if (err) throw err;
      })

      // try {
      //   if (fs.access(outPutText)) {
      //     fs.appendFile(outPutText, nameAdj, (err) => {
      //       if (err) throw err;
      //     })
      //   }
      //   else{
      //     fs.writeFile(outPutText, nameAdj, (err) => {
            
      //       if (err) throw err;
      //     })
      //   }
      // } catch(err) {
      //   console.error(err)
      // }

      this.emit('data', nameAdj)
})
socket.connect(this.params.port, this.params.host, () => {
  socket.write('%1POWR 1 ')
})

// const processName = (pointData) => {
//   const nameToSwap = process.env.nameToSwap
//   //split string into array by deliminator

//   const pointDataList = pointData.split(',')
//   pointDataList[0]= nameToSwap
  
//   pointDataList.join(',')

//   return pointDataList
// }

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

      //Adjust name
      const nameAdj = processName(decoded)
      console.log(nameAdj)

      try {
        if (fs.access(outPutText)) {
          fs.appendFile(outPutText, nameAdj, (err) => {
            if (err) throw err;
          })
        }
        else{
          fs.writeFile(outPutText, nameAdj, (err) => {
            
            if (err) throw err;
          })
        }
      } catch(err) {
        console.error(err)
      }

      //const test = processName(decoded)
      //console.log(test)
      this.emit('data', nameAdj)
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
