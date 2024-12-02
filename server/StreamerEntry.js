// server/StreamerEntry.js
import { TelnetStreamer } from './telnetStreamer.js';
import { StreamerDbBridge } from './StreamerDbBridge.js';
import { Session } from './models/Session.js';
import { logger } from './helpers/logger.js'; // Import the initialized logger

const StreamerEntry = async (stationMac, sessID, stationName) => {
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

  // Initialize the bridge with logger
  const streamerDbBridge = new StreamerDbBridge(streamer, session, logger);

  logger.info('StreamerDbBridge initialized.');

  try {
    await streamerDbBridge.start();
    logger.info('StreamerDbBridge started successfully.');
    return 'Streamer started successfully.';
  } catch (error) {
    logger.error(`Error in StreamerEntry: ${error.message}`);
    throw error;
  }
};

export default StreamerEntry;
