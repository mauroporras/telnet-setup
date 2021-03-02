import { Db } from './src/Db.js'
import { MockStreamer } from './src/MockStreamer.js'
import { TelnetStreamer } from './src/TelnetStreamer.js'
import { StreamerDbBridge } from './src/StreamerDbBridge.js'

const shouldUseMock = process.env.ZEA_STREAMER_TYPE === 'mock'

const streamer = shouldUseMock
  ? new MockStreamer('./assets/mock-points.txt')
  : new TelnetStreamer({
      host: process.env.ZEA_TELNET_HOST,
      port: process.env.ZEA_TELNET_PORT,
    })

const db = new Db()

const streamerDbBridge = new StreamerDbBridge(streamer, db)

await streamerDbBridge.start()
