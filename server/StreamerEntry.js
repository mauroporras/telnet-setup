// server/StreamerEntry.js
import { TelnetStreamer } from './TelnetStreamer.js';
import { StreamerDbBridge } from './StreamerDbBridge.js';
// import { Session } from './models/Sessions.js';
import {Session} from './models/Session.js';

const StreamerEntry = async (stationMac, sessID, stationName) => {
  const ZEA_STREAMER_TYPE = 'telnet'; // Change to 'mock' if using MockStreamer
  const ZEA_SESSION_ID = sessID || 'test';

  // Define the station MAC addresses and names
  const stationMacs = [stationMac];
  const stationNames = [stationName];

  // Initialize the streamer
  const streamer = new TelnetStreamer({
    stationMacs: stationMacs,      // Array of MAC addresses
    stationNames: stationNames,    // Array of station names
    port: 1212,                     // Telnet port
  });

  // Initialize the session
  const session = new Session(ZEA_SESSION_ID);

  // Initialize the bridge
  const streamerDbBridge = new StreamerDbBridge(streamer, session);

  console.log('StreamerDbBridge initialized.');

  try {
    await streamerDbBridge.start();
    console.log('StreamerDbBridge started successfully.');
    return 'Streamer started successfully.';
  } catch (error) {
    console.error('Error in StreamerEntry:', error);
    throw error;
  }
};

export default StreamerEntry;
