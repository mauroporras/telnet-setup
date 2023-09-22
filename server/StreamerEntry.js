import { MockStreamer } from './MockStreamer.js'
import { TelnetStreamer } from './TelnetStreamer.js'
import { StreamerDbBridge } from './StreamerDbBridge.js'

import { Session } from './models/Session.js'

const printStart = () => {
  const consoleOptions = 'background: #ffffff; color: #6b17e8';
  // Standard Figlet Font
  console.log("Running Version: ", "1.0.1", '\n')


 
  console.log('%c                                _ _       _  ', consoleOptions);
  console.log('%c                               | (_)     | |   ', consoleOptions);
  console.log('%c ___ _   _ _ ____   _____ _   _| |_ _ __ | | __', consoleOptions);
  console.log('%c/ __| | | | \'__\ \ / / _ \ | | | | | \'_ \| |/ /', consoleOptions);
  console.log('%c\__ \ |_| | |   \ V /  __/ |_| | | | | | |   < ', consoleOptions);
  console.log('%c|___/\__,_|_|    \_/ \___|\__, |_|_|_| |_|_|\_\\', consoleOptions);
  console.log('%c                           __/ |               ', consoleOptions);
  console.log('%c                           |___/ ', consoleOptions);

 
}


const  StreamerEntry = async (stationMac, sessID, stationName) => {

  // const ZEA_SESSION_ID = 'NyNhQ9U9RTjhH9X1sFrd'

  const ZEA_STREAMER_TYPE = 'telnet' 
  const ZEA_SESSION_ID = sessID || 'test'

// const ZEA_STREAMER_TYPE = process.env.ZEA_STREAMER_TYPE || ''
// const ZEA_SESSION_ID = process.env.ZEA_SESSION_ID || ''

  const shouldUseMock = ZEA_STREAMER_TYPE === 'mock' ? true : false
  // console.log('status ', shouldUseMock)

  const ZEA_TEST_POINTS_FILE = '/home/pi/git/telnet-setup/Setup Survey Points.txt'

  const streamer = shouldUseMock
    ? // ? new MockStreamer(process.env.ZEA_TEST_POINTS_FILE)
      new MockStreamer(ZEA_TEST_POINTS_FILE)
    : new TelnetStreamer({
        // host: ip,
        stationMacs: stationMac,
        stationNames: stationName,
        // host: process.env.ZEA_TELNET_HOST,
        // host: '192.168.1.3',
        // port: process.env.ZEA_TELNET_PORT,
        port: 1212,
      })


  
  const sessionId = ZEA_SESSION_ID
 

  const session = new Session(sessionId)

  const streamerDbBridge = new StreamerDbBridge(streamer, session)
  
  printStart()
  console.log('session started ')
  
  const dataReturned = await streamerDbBridge.start()
  // console.log('dataReturned', dataReturned)
  //streamerDbBridge.send(cmd)
  
  return dataReturned
}

export default StreamerEntry;
