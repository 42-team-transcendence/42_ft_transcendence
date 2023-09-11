import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './components/App';
import { AuthProvider } from "./context/AuthProvider";
import { OnlineStatusProvider } from './context/OnlineStatus';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SocketIOProvider } from './context/SocketProvider';

const container = document.getElementById('root');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(
	// React.StrictMode renders components twice (on dev but not production)
	//  in order to detect any problems with your code and warn you about them
	// <React.StrictMode>
		<BrowserRouter>
		<AuthProvider>
		<SocketIOProvider>
		<OnlineStatusProvider>	
			<Routes>
				<Route path="/*" element={<App />} />
			</Routes>
		</OnlineStatusProvider>
		</SocketIOProvider>	
		</AuthProvider>
		</BrowserRouter>
	// </React.StrictMode>
);