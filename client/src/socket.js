// client/src/socket.js
import { io } from 'socket.io-client';

const SOCKET_IO_URL = process.env.REACT_APP_SOCKET_IO_URL || 'http://localhost:3002';

const socket = io(SOCKET_IO_URL, {
  transports: ['websocket'], // Use WebSocket transport only
  // Additional options if needed
});

export default socket;
