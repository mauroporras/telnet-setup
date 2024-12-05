// server/index.js
import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';
import { logger, loggerEmitter } from './helpers/logger.js'; // Import both logger and emitter first

const app = express();
const server = http.createServer(app);

// Initialize Socket.io with CORS settings
const io = new SocketIOServer(server, {
  cors: {
    origin: "*", // Allow all origins; adjust as needed for security
    methods: ["GET", "POST"]
  }
});

// Listen to log events and emit them via Socket.io to the frontend
loggerEmitter.on('log', (log) => {
  io.emit('log', log);
});

// Now import modules that depend on the logger
import StreamerEntry from './StreamerEntry.js';
// Now import modules that depend on the logger
// import { StreamerDbBridge } from './StreamerDbBridge.js';
// import { Session } from './models/Session.js';
// import { TelnetStreamer } from './helpers/telnetStreamer.js';

// Middleware setup
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// API Endpoints

/**
 * GET /api
 * Simple endpoint to verify server is running
 */
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from server!' });
  logger.info('GET /api called');
});

/**
 * POST /api/button
 * Endpoint to start the streamer
 */
app.post('/api/button', async (req, res) => {
  const { title, sessionID, stationMac, stationNames } = req.body;
  logger.info(`POST /api/button called with: ${JSON.stringify({ sessionID, stationMac, stationNames })}`);

  try {
    const data = await StreamerEntry(stationMac, sessionID, stationNames);
    res.json({ message: 'Streamer started successfully. index' });
    io.emit('stream-data', data); // Emit data to all connected clients
    logger.info('Streamer started successfully and data emitted to clients.');
  } catch (error) {
    logger.error(`Error starting streamer: ${error.message}`);
    res.status(500).json({ message: 'Failed to start streamer.' });
  }
});

// Socket.io Connection Handler
io.on('connection', (socket) => {
  logger.info('A user connected via Socket.io');

  socket.on('disconnect', () => {
    logger.info('A user disconnected from Socket.io');
  });
});

// Start Server
const PORT = process.env.PORT || 3002;

server.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
