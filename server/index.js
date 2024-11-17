// server/index.js
import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';
import StreamerEntry from './StreamerEntry.js'; // Corrected import
import logger, { addLoggerTransport } from './helpers/logger.js'; // Corrected import

import Transport from 'winston-transport';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
  }
});

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// API Endpoints
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from server!' });
  logger.info('GET /api called');
});

app.post('/api/button', async (req, res) => {
  const { title, sessionID, stationMac, stationNames } = req.body;
  logger.info(`POST /api/button called with: ${JSON.stringify({ sessionID, stationMac, stationNames })}`);

  try {
    const data = await StreamerEntry(stationMac, sessionID, stationNames);
    res.json({ message: 'Streamer started successfully.' });
    io.emit('stream-data', data); // Emit data to all connected clients
    logger.info('Streamer started successfully and data emitted to clients.');
  } catch (error) {
    logger.error(`Error starting streamer: ${error.message}`);
    res.status(500).json({ message: 'Failed to start streamer.' });
  }
});

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Custom Socket.IO Transport for Winston
class SocketIOTransport extends Transport {
  constructor(opts) {
    super(opts);
    this.io = opts.io;
  }

  log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    const logMessage = {
      timestamp: info.timestamp,
      level: info.level,
      message: info.message,
    };

    // Emit the log to all connected clients
    this.io.emit('log', logMessage);

    callback();
  }
}

// Add the custom transport to the logger
addLoggerTransport(new SocketIOTransport({ io }));

// Start Server
const PORT = process.env.PORT || 3002;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
