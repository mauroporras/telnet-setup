// client/src/config.js
const isDev = process.env.NODE_ENV === 'development';

export const API_BASE_URL = isDev
  ? 'http://localhost:3002'
  : 'http://localhost:3002'; // Same as development since backend is within Electron
export const WS_URL = isDev
  ? 'ws://localhost:3002'
  : 'ws://localhost:3002';
