import net from 'net'
import { zeaDebug } from './helpers/zeaDebug.js'
import { BaseStreamer } from './BaseStreamer.js'

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

  send(data) {
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
