// client/src/component/App.js
import React, { useState, useEffect } from 'react';
import DropDownListSession from './DropDownListSession.js';
import ButtonStart from './Button.js';
import Output from './Output.js';
import { Box, Typography, CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import socket from '../socket'; // Import the socket instance
import { API_BASE_URL, WS_URL } from '../config'; // Import config variables

const App = () => {
  const [buttonStatus, setButtonStatus] = useState(false);
  const [sessionIDValue, setSessionIDValue] = useState('');
  const [stationIDValue, setStationIDValue] = useState('');
  const [stationName, setStationName] = useState('');
  const [data, setData] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Start connection');
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]); // State to hold logs

  useEffect(() => {
    if (buttonStatus) {
      setLoading(true);
      const requestOptions = {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json' 
        },
        body: JSON.stringify({ 
          title: 'start telnet streamer',
          sessionID: sessionIDValue,
          stationMac: stationIDValue,
          stationNames: stationName,
        })
      };

      fetch(`${API_BASE_URL}/api/button`, requestOptions)
        .then((res) => res.json())
        .then((data) => {
          setData(data.message);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error:', error);
          setData('Connection failed.');
          setLoading(false);
        });

      setButtonStatus(false);
    }

    // WebSocket event listeners

    // Listen for 'stream-data' events
    socket.on('stream-data', (streamData) => {
      setData(streamData);
    });

    // Listen for 'log' events
    socket.on('log', (log) => {
      setLogs((prevLogs) => [...prevLogs, log]);
    });

    // Listen for 'connect' event
    socket.on('connect', () => {
      setConnectionStatus('Connected');
    });

    // Listen for 'disconnect' event
    socket.on('disconnect', () => {
      setConnectionStatus('Disconnected');
    });

    // Listen for 'connect_error' event
    socket.on('connect_error', (error) => {
      setConnectionStatus('Connection Error');
      console.error('WebSocket connection error:', error);
    });

    // Listen for 'reconnect_attempt' event
    socket.on('reconnect_attempt', () => {
      setConnectionStatus('Trying to reconnect');
    });

    // Listen for 'reconnect_error' event
    socket.on('reconnect_error', (error) => {
      setConnectionStatus('Reconnection Error');
      console.error('Reconnection error:', error);
    });

    // Listen for 'reconnect_failed' event
    socket.on('reconnect_failed', () => {
      setConnectionStatus('Failed to reconnect');
    });

    // Listen for 'reconnect' event
    socket.on('reconnect', () => {
      setConnectionStatus('Connected');
    });

    // Cleanup on component unmount
    return () => {
      socket.off('stream-data');
      socket.off('log');
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('reconnect_attempt');
      socket.off('reconnect_error');
      socket.off('reconnect');
    };
  }, [buttonStatus, sessionIDValue, stationIDValue, stationName]);

  return (
    <ThemeProvider theme={createTheme()}>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Telnetserver Control Panel
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <DropDownListSession 
            setSessionIDValue={setSessionIDValue} 
            setStationIDValue={setStationIDValue} 
            setStationName={setStationName}
          />
          <ButtonStart setButtonStatus={setButtonStatus} />
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1">
            Connection Status: <span style={{ color: getStatusColor(connectionStatus) }}>{connectionStatus}</span>
            {loading && <CircularProgress size={20} sx={{ ml: 2 }} />}
          </Typography>
        </Box>

        <Output data={data} />

        {/* Display Logs */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Application Logs
          </Typography>
          <Box sx={{ maxHeight: '300px', overflowY: 'scroll', border: '1px solid #ccc', p: 2 }}>
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <Typography key={index} variant="body2">
                  <strong>[{log.timestamp}]</strong> <span style={{ color: getLogColor(log.level) }}>{log.level.toUpperCase()}</span>: {log.message}
                </Typography>
              ))
            ) : (
              <Typography variant="body2">No logs to display.</Typography>
            )}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Start connection':
      return 'yellow';
    case 'Connected':
      return 'green';
    case 'Connecting':
      return 'blue';
    case 'Connection Error':
    case 'Reconnection Error':
    case 'Failed to reconnect':
      return 'red';
    case 'Trying to reconnect':
      return 'orange';
    default:
      return 'black';
  }
};
const getLogColor = (level) => {
  switch (level) {
    case 'info':
      return 'green';
    case 'warn':
      return 'orange';
    case 'error':
      return 'red';
    default:
      return 'black';
  }
};

export default App;
