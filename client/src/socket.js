// client/src/socket.js
import { io } from 'socket.io-client';
import { WS_URL } from './config';

const socket = io(WS_URL, {
  transports: ['websocket'],
});

export default socket;
