import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useSocketIO } from './SocketProvider';

//creation du contexte
// const OnlineStatusContext = createContext<string[]>([]);
const OnlineStatusContext = createContext<Map<string, string>>(new Map());


//le composant qui enveloppera l'application et gérera l'état en ligne/hors ligne.
export const OnlineStatusProvider = ({ children }: {children: React.ReactNode}) => {
  const {socket} = useSocketIO();
//   const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<Map<string, string>>(new Map());

//   useEffect(() => {
//     socket.on('onlineUsers', (userIds) => {
//       // Met à jour la liste des utilisateurs en ligne avec la liste reçue du serveur
//       setOnlineUsers(userIds);
// 	  console.log('Online users updated:', userIds);
//     });

//     return () => {
//       socket.off('onlineUsers');
//     };
//   }, []);

useEffect(() => {
    socket.on('onlineUsers', (userMap) => {
      // Met à jour la liste des utilisateurs en ligne avec la liste reçue du serveur
      setOnlineUsers(new Map(userMap));
	  console.log('Online users updated:', userMap);
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
