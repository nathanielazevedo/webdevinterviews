import { useEffect, useRef, useState } from 'react';

export function useWebSocket(url, roomId, userId) {
  const [isConnected, setIsConnected] = useState(false);
  const [opponentResults, setOpponentResults] = useState(null);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      setIsConnected(true);
      
      // Join the room
      ws.current.send(JSON.stringify({
        type: 'join',
        roomId,
        userId
      }));
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === 'opponent-results') {
        setOpponentResults({
          passed: message.passed,
          total: message.total
        });
      }
    };

    ws.current.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url, roomId, userId]);

  const sendTestResults = (passed, total) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'test-results',
        passed,
        total
      }));
    }
  };

  return {
    isConnected,
    opponentResults,
    sendTestResults
  };
}