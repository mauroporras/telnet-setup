import { MockStreamer } from './src/MockStreamer.js'
import { TelnetStreamer } from './src/TelnetStreamer.js'
import { StreamerDbBridge } from './src/StreamerDbBridge.js'

import { Session } from './src/models/Session.js'

const shouldUseMock = process.env.ZEA_STREAMER_TYPE === 'mock'

const streamer = shouldUseMock
  ? new MockStreamer(process.env.ZEA_TEST_POINTS_FILE)
  : new TelnetStreamer({
      host: process.env.ZEA_TELNET_HOST,
      port: process.env.ZEA_TELNET_PORT,
    })

const sessionId = process.env.ZEA_SESSION_ID
const sessionName = process.env.ZEA_SESSION_NAME

const session = new Session(sessionId, sessionName)

const streamerDbBridge = new StreamerDbBridge(streamer, session)

await streamerDbBridge.start()
