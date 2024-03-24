import { MockStreamer } from './src/MockStreamer.js'
import { TelnetStreamer } from './src/TelnetStreamer.js'
import { StreamerDbBridge } from './src/StreamerDbBridge.js'

import { Session } from './src/models/Session.js'

const ZEA_STREAMER_TYPE = process.env.ZEA_STREAMER_TYPE
const ZEA_SESSION_ID = process.env.ZEA_SESSION_ID
const ZEA_TEST_POINTS_FILE = process.env.ZEA_TEST_POINTS_FILE

if (!ZEA_STREAMER_TYPE) {
  throw Error('Missing "ZEA_STREAMER_TYPE" env var.')
}

if (!ZEA_SESSION_ID) {
  throw Error('Missing "ZEA_SESSION_ID" env var.')
}

if (!ZEA_TEST_POINTS_FILE) {
  throw Error('Missing "ZEA_TEST_POINTS_FILE" env var.')
}

const shouldUseMock = ZEA_STREAMER_TYPE === 'mock'

const streamer = shouldUseMock
  ? new MockStreamer(ZEA_TEST_POINTS_FILE)
  : new TelnetStreamer(process.env.ZEA_TELNET_HOST, process.env.ZEA_TELNET_PORT)

const session = new Session(ZEA_SESSION_ID)

const streamerDbBridge = new StreamerDbBridge(streamer, session)

await streamerDbBridge.start()
