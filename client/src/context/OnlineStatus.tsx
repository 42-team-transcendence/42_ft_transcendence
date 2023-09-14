import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './SocketProvider';

//creation du contexte
// const OnlineStatusContext = createContext<string[]>([]);
const OnlineStatusContext = createContext<Map<string, Online>>(new Map());

interface Online {
	userId: string;
	isOnline: boolean;
  }

//le composant qui enveloppera l'application et gérera l'état en ligne/hors ligne.
export const OnlineStatusProvider = ({ children }: {children: React.ReactNode}) => {
  const socket = useSocket();
//   const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<Map<string, Online>>(new Map());

useEffect(() => {
    socket?.on('onlineUsers', (userMap) => {
      // Met à jour la liste des utilisateurs en ligne avec la liste reçue du serveur
      setOnlineUsers(new Map(userMap));
	  // console.log('Online users updated:', userMap);
    });

    return () => {
      socket?.off('onlineUsers');
    };
  }, []);

  return (
    <OnlineStatusContext.Provider value={onlineUsers}>
      {children}
    </OnlineStatusContext.Provider>
  );
};

export const useOnlineStatus = () => useContext(OnlineStatusContext);
