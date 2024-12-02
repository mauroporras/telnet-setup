// server/helpers/logger.js
import winston from 'winston';
import { EventEmitter } from 'events';
import { Writable } from 'stream'; // Import Writable from 'stream'

// Create an instance of EventEmitter
const loggerEmitter = new EventEmitter();

// Define a custom Writable stream to emit log events
const emitStream = new Writable({
  write(chunk, encoding, callback) {
    try {
      const log = JSON.parse(chunk.toString());
      loggerEmitter.emit('log', log);
      callback();
    } catch (error) {
      // Handle JSON parse error if the log format is not JSON
      console.error('Failed to parse log message:', chunk.toString());
      callback(error);
    }
  }
});

// Define a custom transport to emit log events
const emitTransport = new winston.transports.Stream({
  stream: emitStream, // Use the proper Writable stream
});

// Create Winston logger with Console, File, and Emit transports
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'combined.log' }),
    emitTransport, // Custom transport to emit logs
  ],
});

export { logger, loggerEmitter };
