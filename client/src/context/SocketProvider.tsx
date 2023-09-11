// socketio.context.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketIOContextType {
  socket: Socket;
}

interface SocketProviderProps {
	children: React.ReactNode;
  }

const SocketIOContext = createContext<SocketIOContextType | undefined>(undefined);

export const SocketIOProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket] = useState(() => io('http://localhost:3333', {
	path: "/status",
	withCredentials: true,
	autoConnect: true,
	auth: { token: "TODO: gérer les tokens d'authentification ici" },
})); 

  useEffect(() => {
    socket.on('connect', () => {
    });

    socket.on('disconnect', () => {
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketIOContext.Provider value={{ socket }}>
      {children}
    </SocketIOContext.Provider>
  );
};

export const useSocketIO = () => {
  const context = useContext(SocketIOContext);

  if (context === undefined) {
    throw new Error('useSocketIO must be used within a SocketIOProvider');
  }

  return context;
};
