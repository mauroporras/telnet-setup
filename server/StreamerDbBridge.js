// server/StreamerDbBridge.js
import { CommandQueue } from './helpers/CommandQueue.js';
// import { Command } from './models/Command.js';


class StreamerDbBridge {
  constructor(streamer, session, logger) { // Removed 'io' from constructor
    this.streamer = streamer;
    this.session = session;
    this.commandQueue = new CommandQueue(this.streamer);
    this.logger = logger;
    this.isStarting = false; // Guard flag to prevent recursive starts
  }

  /**
   * Starts the bridge by connecting the streamer and initializing the session.
   */
  async start() {
    if (this.isStarting) {
      this.logger.warn('StreamerDbBridge is already starting. Skipping redundant start.');
      return;
    }

    this.isStarting = true;

    try {
      await this.streamer.connect();
      await this.session.init();
      // Clear any pending old commands before starting
      await this.session.clearPendingCommands();
      // start the stream
      this.streamer.send('%R8Q,5:\r\n') // stop stream
      this.streamer.send('%R8Q,4:\r\n')// start stream

      const { Command } = await import('./models/Command.js');

      // Listen for new commands from the session
      this.session.onCommandCreated((data) => {
        this.logger.info(`Command created for anchor: ${data.anchor}`);
        
        const command = new Command(this.streamer, this.session, data);
        this.commandQueue.addCommand(command);
        // this.logger.info('Command added to queue.', command);
      });

      // Listen for data points from the streamer
      this.streamer.on('point', (point) => {
        if (this.commandQueue.isInProgress) return;
        this.logger.info(`Received point: "${point}"`);
        // this.logger.data(point);
        this.session.addPoint(point);
      });

      // Handle streamer reset events
      this.streamer.on('reset', () => {
        this.logger.warn('Resetting Streamer...');
        setTimeout(() => {
          this.commandQueue.clearCommandQueue();
          if (this.streamer.socket) {
            this.streamer.socket.end();
            this.streamer.socket.destroy();
          }
          this.start(); // This is safe now due to the guard
          this.logger.info('Streamer restarted.');
        }, 2000);
      });

      // Handle socket timeouts
      this.streamer.socket.once('timeout', () => {
        this.logger.error('Socket timeout occurred. Attempting to reconnect...');
        this.commandQueue.clearCommandQueue();
        if (this.streamer.socket) {
          this.streamer.socket.end();
          this.streamer.socket.destroy();
        }
        this.start();
      });
    } catch (error) {
      this.logger.error(`Error in StreamerDbBridge start: ${error.message}`);
    } finally {
      this.isStarting = false;
    }
  }
}

export { StreamerDbBridge };
