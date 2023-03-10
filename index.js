import { MockStreamer } from './src/MockStreamer.js'
import { TelnetStreamer } from './src/TelnetStreamer.js'
import { StreamerDbBridge } from './src/StreamerDbBridge.js'

import { Session } from './src/models/Session.js'

const ZEA_STREAMER_TYPE = process.env.ZEA_STREAMER_TYPE || ''
const ZEA_SESSION_ID = process.env.ZEA_SESSION_ID || ''

// console.log(
//   'session ',
//   ZEA_STREAMER_TYPE.length,
//   'mock'.length,
//   ZEA_STREAMER_TYPE === 'mock'
// )
// console.log('session ', ZEA_SESSION_ID)

// const shouldUseMock = process.env.ZEA_STREAMER_TYPE === 'mock' ? true : false
const shouldUseMock = ZEA_STREAMER_TYPE === 'mock' ? true : false
// console.log('status ', shouldUseMock)

const ZEA_TEST_POINTS_FILE =
  'C:/Box/R&D Services/Restricted/04_Research Trajectories/BROWER SRVY REVIEW/SURVEYLINK_MVP/Mockup/Setup Survey Points.txt'

const streamer = shouldUseMock
  ? new MockStreamer(ZEA_TEST_POINTS_FILE)
  : new TelnetStreamer({
      host: process.env.ZEA_TELNET_HOST,
      port: process.env.ZEA_TELNET_PORT,
    })

const sessionId = ZEA_SESSION_ID

const session = new Session(sessionId)

const streamerDbBridge = new StreamerDbBridge(streamer, session)
await streamerDbBridge.start()
