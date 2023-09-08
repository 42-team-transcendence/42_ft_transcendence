import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

// Set up WebSocket connection
const socket = io('http://localhost:3333', {
	path: "/status",
	// withCredentials: true,
	// autoConnect: true,
	// auth: { token: "TODO: gérer les tokens d'authentification ici" },
});

//creation du contexte
const OnlineStatusContext = createContext<string[]>([]);

//le composant qui enveloppera l'application et gérera l'état en ligne/hors ligne.
export const OnlineStatusProvider = ({ children }: {children: React.ReactNode}) => {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    socket.on('onlineUsers', (userIds) => {
      // Met à jour la liste des utilisateurs en ligne avec la liste reçue du serveur
      setOnlineUsers(userIds);
	  console.log('Online users updated:', userIds);
    });

    return () => {
      socket.off('onlineUsers');
    };
  }, []);

  return (
    <OnlineStatusContext.Provider value={onlineUsers}>
      {children}
    </OnlineStatusContext.Provider>
  );
};

export const useOnlineStatus = () => useContext(OnlineStatusContext);
