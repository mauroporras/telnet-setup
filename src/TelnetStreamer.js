import net from 'net'
import { zeaDebug } from './helpers/zeaDebug.js'
import { BaseStreamer } from './BaseStreamer.js'
import { TotalStationResponses } from './models/Command.js'

const SURVEY_STREAMING_RESPONSE_PREFIX = '%R8P'

class TelnetStreamer extends BaseStreamer {
  constructor(host, port) {
    super()

    this.host = host
    this.port = port
  }

  async connect() {
    const socket = new net.Socket()

    this.socket = socket

    socket.on('error', (err) => console.error('Socket error:', err))

    socket.on('data', this.#handleData.bind(this))

    socket.connect(this.port, this.host, () => {
      socket.write('%1POWR 1 ')
    })
  }

  async send(data) {
    this.socket.write(data)

    zeaDebug('Sent:', data)
  }

  #handleData(data) {
    const decoded = data.toString('utf8').trim()

    zeaDebug('Received:', decoded)

    const isStreamingResponse = decoded.startsWith(
      SURVEY_STREAMING_RESPONSE_PREFIX
    )

    if (isStreamingResponse) {
      const responseCode = decoded.substring(decoded.lastIndexOf(':') + 1)

      if (responseCode !== '0') {
        throw new Error(TotalStationResponses[responseCode])
      }

      this.emit('streaming-response', decoded)

      return
    }

    throw new Error(`Unhandled data: ${decoded}`)
  }
}

export { TelnetStreamer }
