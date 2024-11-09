import net from 'net';
import { zeaDebug } from './helpers/zeaDebug.js';
import { BaseStreamer } from './BaseStreamer.js';
import find from 'local-devices';
import printStart from './helpers/hello.js';
import logger from './helpers/logger.js'; // Import the Winston logger

const SURVEY_STREAMING_RESPONSE_PREFIX = '%R8P';

async function getIp(stationMacs) {
  let attempts = 0;
  const maxAttempts = 5;
  let found = [];
  let notFound = true;

  while (notFound && attempts < maxAttempts) {
    const devices = await find();
    console.log('Devices found:', devices);
    const matchedDevices = devices.filter(device => stationMacs.includes(device.mac));
    if (matchedDevices.length > 0) {
      found = matchedDevices;
      notFound = false;
    } else {
      console.log(`Attempt ${attempts + 1}: No matching devices found. Retrying...`);
      logger.warn(`Attempt ${attempts + 1}: No matching devices found. Retrying...`);
      attempts++;
      await new Promise(res => setTimeout(res, 2000)); // Wait 2 seconds before retrying
    }
  }

  return found;
}

class TelnetStreamer extends BaseStreamer {
  constructor(params) {
    super();
    this.params = params;
    this.socket = null;
    this.counter = 0;
    this.close = false;
    this.GLOBAL_TIMEOUT = 10000; // 10 seconds
  }

  async connect() {
    const socket = new net.Socket();
    this.socket = socket;
    const foundStations = await getIp(this.params.stationMacs);

    if (foundStations.length === 0) {
      console.log('No IP found for the provided MAC addresses. Restart the server and try again.');
      logger.warn('No IP found for the provided MAC addresses. Restart the server and try again.');
      this.emit('error', new Error('No IP found for the provided MAC addresses.'));
      return;
    }

    // Assuming one station per streamer. Modify if multiple are supported.
    const station = foundStations[0];
    const ipToConnect = station.ip;

    console.log('Connecting to IP:', ipToConnect);
    logger.info('Connecting to IP:', ipToConnect);

    this.params.host = ipToConnect;

    printStart();
    console.log('\n------------------ Session Streaming ------------------');
    logger.info('\n------------------ Session Streaming ------------------');

    socket.on('error', (err) => {
      console.error('Socket error:', err.message);

      if ((err.code === 'ECONNRESET' || err.code === 'EPIPE') && this.counter < 5) {
        console.log(`Socket error -- ${err.code}, waiting 2 seconds to reconnect...`);
        logger.warn(`Socket error -- ${err.code}, waiting 2 seconds to reconnect...`);
        this.counter++;
        setTimeout(() => {
          this.emit('reset');
        }, 2000);
      } else if (this.counter >= 5 && !this.close) {
        console.log(`Socket error -- ${err.code}, max retries reached. Attempting to reconnect...`);
        logger.warn(`Socket error -- ${err.code}, max retries reached. Attempting to reconnect...`);
        this.counter++;
        this.close = true;
        setTimeout(() => {
          this.emit('reset');
        }, 5000);
      }
    });

    socket.on('data', this.#handleData.bind(this));

    socket.on('close', () => {
      console.log('Socket closed.');
      logger.warn('Socket closed.');
      this.emit('end');
    });

    socket.connect(this.params.port, this.params.host, () => {
      console.log('Connected to Telnet server.');
      logger.info('Connected to Telnet server.');
      socket.write('%1POWR 1 ');
    });
  }

  send(data) {
    if (this.socket && !this.socket.destroyed) {
      this.socket.write(data);
      zeaDebug('Sent:', data);
    } else {
      console.error('Cannot send data, socket is not connected.');
      logger.info('Cannot send data, socket is not connected.');
      this.emit('error', new Error('Socket not connected.'));
    }
  }

  #handleData(data) {
    const decoded = data.toString('utf8').trim();
    zeaDebug('Received:', decoded);

    const isStreamingResponse = decoded.startsWith(SURVEY_STREAMING_RESPONSE_PREFIX);
    const eventType = isStreamingResponse ? 'streaming-response' : 'point';
    this.emit(eventType, decoded);
  }

  /**
   * Reconnects to the Telnet server.
   */
  async reconnect() {
    console.log('Reconnecting to Telnet server...');
    logger.info('Reconnecting to Telnet server...');
    if (this.socket) {
      this.socket.destroy();
    }
    await this.connect();
  }
}

export { TelnetStreamer };
