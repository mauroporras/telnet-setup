import net from 'net'
// import Telnet from 'telnet-client'
// import util from 'util'
import { zeaDebug } from './helpers/zeaDebug.js'
import { BaseStreamer } from './BaseStreamer.js'
import find from 'local-devices'

const SURVEY_STREAMING_RESPONSE_PREFIX = '%R8P'

async function getIp() {
  var i = 0
  var notFound = true
  var found
  var foundPrevious

  while (notFound) {
    foundPrevious = found
    found = await find()
    console.log(
      `what did we find on network "${found.length}", max number pings "${i}"`
    )
    // console.log('what did we find', i, found.length, found)
    if (foundPrevious) {
      if (found.length == foundPrevious.length) notFound = false
    }
    if (i < 5 || found.length < 1) i++
    else notFound = false
  }

  return found
}

class TelnetStreamer extends BaseStreamer {
  constructor(params) {
    super()

    this.params = params
    this.ipAddress = ''
    this.counter = 0
    this.GLOBAL_TIMEOUT = 5000 // 5 seconds
  }

  async connect() {
    const socket = new net.Socket()
    this.socket = socket
    const foundStationIP = await getIp()

    try {
      var ipToReturn

      console.log(
        'stationIP',
        this.params,
        this.params.stationMacs,
        this.params.stationNames
      )
      foundStationIP.forEach((each) => {
        if (each.mac.includes(this.params.stationMacs)) {
          ipToReturn = each.ip
        }
      })
      if (!ipToReturn) throw new Error('No IP found for that Mac address')

      console.log('Ip address found for that Mac address', ipToReturn)

      this.params.host = ipToReturn
    } catch {
      console.log('IP not found, restart server and try again')
      return
    }

    console.log('here is the address found ', this.params.host)
    console.log('\n------------------session streaming------------------')

    socket.on('error', (err) => {
      console.error('Socket error:', err)

      if (err.code === 'ECONNRESET' && this.counter < 5) {
        // exceptiong for when the socket is closed
        console.log(
          'Socket error -- ECONNRESET, waiting 2 seconds to reconnect...'
        )
        console.log('counter', this.counter)
        setTimeout(() => {
          this.emit('reset')
        }, 5000)
        this.counter++
      } else if (err.code === 'EPIPE' && this.counter >= 5) {
        console.log('Socket error -- EPIPE, waiting 2 seconds to reconnect...')
        setTimeout(() => {
          console.log('Reconnecting...')
          this.emit('reset')
        }, 5000)
        this.counter++
      }
    })

    socket.on('data', this.#handleData.bind(this))

    socket.connect(this.params.port, this.params.host, () => {
      socket.write('%1POWR 1 ')
    })
  }

  send(data) {
    // console.log('send data', data, this.socket)
    this.socket.write(data)
    zeaDebug('Sent:', data)
  }

  #handleData(data) {
    const decoded = data.toString('utf8').trim()

    zeaDebug('Received:', decoded)

    const isStreamingResponse = decoded.startsWith(
      SURVEY_STREAMING_RESPONSE_PREFIX
    )

    // A point looks like this:
    // TS0012,410.9147,512.9075,103.3155,10/07/2020,18:53:02.68,16934825

    const eventType = isStreamingResponse ? 'streaming-response' : 'point'
    this.emit(eventType, decoded)
  }
}

export { TelnetStreamer }
