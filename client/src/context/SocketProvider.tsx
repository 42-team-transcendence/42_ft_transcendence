import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { axiosPrivate } from '../api/axios';
import useAuth from '../hooks/useAuth';

// Définissez le type pour votre contexte
interface SocketContextType {
  socket: Socket | null;
}

// Créez un contexte pour la socket
const SocketContext = createContext<SocketContextType>({ socket: null });

// Fonction pour créer une instance de socket
function createSocket(userId: number): Socket {
  const socket = io("http://localhost:3333", {
    path: "/status",
    withCredentials: true,
    autoConnect: true,
    auth: { token: "TODO : gérer les tokens d'authentification ici" },
    query: {"userId": userId},
  });

  return socket;
}

// Fournit le contexte de la socket à l'ensemble de l'application
interface ProvideSocketProps {
  children: ReactNode;
}

export function ProvideSocket({ children }: ProvideSocketProps): JSX.Element {

  const {auth} = useAuth();

  const socket = createSocket(auth.userId);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

// Utilisez ce hook personnalisé pour accéder à la socket dans vos composants
export function useSocket(): Socket | null {
  const { socket } = useContext(SocketContext);
  return socket;
}
