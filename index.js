import { MockStreamer } from './src/MockStreamer.js'
import { TelnetStreamer } from './src/TelnetStreamer.js'
import { ZeaCollabBridge } from './src/ZeaCollabBridge.js'

const shouldUseMock = process.env.ZEA_STREAMER_TYPE === 'mock'

const streamer = shouldUseMock
  ? new MockStreamer('./assets/mock-points.txt')
  : new TelnetStreamer({
      host: process.env.ZEA_TELNET_HOST,
      port: process.env.ZEA_TELNET_PORT,
    })

const roomId = process.env.ZEA_COLLAB_ROOM_ID

const zeaCollabBridge = new ZeaCollabBridge(streamer, roomId)

await zeaCollabBridge.start()
