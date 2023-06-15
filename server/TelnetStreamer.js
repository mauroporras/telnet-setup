import net from 'net'
import Telnet from 'telnet-client'
// import util from 'util'
import { zeaDebug } from './helpers/zeaDebug.js'
import { BaseStreamer } from './BaseStreamer.js'
import find from 'local-devices'
//LuigiMacAddress = '00:17:17:06:8a:a5'
//MarioMacAddress = '00:17:17:06:9f:ac'
let LuigiMac = ['00:17:17:06:8a:a5', '00:17:17:06:9f:ac'] //, '00:17:17:03:82:76'

const SURVEY_STREAMING_RESPONSE_PREFIX = '%R8P'

async function getIp() {
  //find().then(devices => { console.log('found the IP in the promise', devices)
  var i = 0
  var notFound = true
  var found

  while (notFound) {
    found = await find()
    console.log(
      `what did we find on network "${found.length}", max number pings "${i}"`
    )
    // console.log('what did we find', i, found.length, found)

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

    // this.bootstrapTelnetClient() // Linux
    // this.#bootstrapTelnetClient() // Windows
  }

  async connect() {
    const params = {
      shellPrompt: '',
      ...this.params,
    }

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
        // if (each.mac.includes(LuigiMac[0]) || each.mac.includes(LuigiMac[1]) ) {
        if (each.mac.includes(this.params.stationMacs)) {
          // console.log('LuigiMac', each.ip)
          ipToReturn = each.ip
        } else {
          console.log(
            'No Station Mac Address found, did you select the right Multistation? Mario vs Luigi?'
          )
        }
      })

      console.log('Ip address found for that Mac address', ipToReturn)

      this.params.host = ipToReturn
    } catch {
      console.log('IP not found, restart server and try again')
    }

    console.log('looking for something this.params.host', this.params.host)
    console.log('------------------session streaming------------------')

    socket.on('error', (err) => {
      console.error('Socket error:', err)

      if (err.code === 'ECONNRESET' && this.counter < 5) {
        // exceptiong for when the socket is closed
        console.log('Socket error, waiting 2 seconds to reconnect...')
        setTimeout(() => {
          console.log('Reconnecting...')
          socket.connect(this.params.port, this.params.host, () => {
            socket.write('%1POWR 1 ')
          })
        }, 2000)
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
  
  runTimeOut() {
    const start = Date.now()
    let runTime = Math.floor((Date.now() - start) / 1000) 
    console.log('time', time)

    if (runTime > 100) {

      console.log('time is greater than 30 seconds, stop stream and mark command as invoked')
      // this.streamer.send(TotalStationCommands.STOP_STREAM)
      // this.#markAsInvoked()
      console.log('Reconnecting...')

      socket.connect(this.params.port, this.params.host, () => {
        socket.write('%1POWR 1 ')
      })
      
      console.log('reconnect attempted')
    }
  }

  #handleData(data) {
    const decoded = data.toString('utf8').trim()

    zeaDebug('Received:', decoded)

    const isStreamingResponse = decoded.startsWith(
      SURVEY_STREAMING_RESPONSE_PREFIX
    )
    // if too much time has passed, reconnect
    runTimeOut()
    
    // A point looks like this:
    // TS0012,410.9147,512.9075,103.3155,10/07/2020,18:53:02.68,16934825

    const eventType = isStreamingResponse ? 'streaming-response' : 'point'

    this.emit(eventType, decoded)
  }
}

export { TelnetStreamer }
