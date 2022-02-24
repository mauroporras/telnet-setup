

import { MockStreamer } from './MockStreamer.js'
import { TelnetStreamer } from './TelnetStreamer.js'
import { StreamerDbBridge } from './StreamerDbBridge.js'

import { Session } from './models/Session.js'



const  StreamerEntry = async (ip, sessID) => {
  // const ZEA_STREAMER_TYPE = process.env.ZEA_STREAMER_TYPE || 'mock'
  // const ZEA_SESSION_ID = process.env.ZEA_SESSION_ID || 'test'
  // const ZEA_STREAMER_TYPE = 'telnet' 
  const ZEA_STREAMER_TYPE = 'mock' 
  const ZEA_SESSION_ID = sessID || 'test'

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
    ? // ? new MockStreamer(process.env.ZEA_TEST_POINTS_FILE)
      new MockStreamer(ZEA_TEST_POINTS_FILE)
    : new TelnetStreamer({
        host: ip,
        // host: process.env.ZEA_TELNET_HOST,
        // host: '192.168.1.3',
        // port: process.env.ZEA_TELNET_PORT,
        port: 1212,
      })

  
  const sessionId = ZEA_SESSION_ID
  // const sessionName = process.env.ZEA_SESSION_NAME
  const sessionName = ZEA_SESSION_ID

  const session = new Session(sessionId, sessionName)

  const streamerDbBridge = new StreamerDbBridge(streamer, session)
  console.log('session started ')
  
  const dataReturned = await streamerDbBridge.start()
  console.log('dataReturned', dataReturned)

  return dataReturned
}

export default StreamerEntry;