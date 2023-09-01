import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './components/App';
import { AuthProvider } from "./context/AuthProvider";
import { OnlineStatusProvider } from './context/OnlineSatus';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const container = document.getElementById('root');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(
	// React.StrictMode renders components twice (on dev but not production)
	//  in order to detect any problems with your code and warn you about them
	// <React.StrictMode>
		<BrowserRouter>
		<AuthProvider>
		<OnlineStatusProvider>	
			<Routes>
				<Route path="/*" element={<App />} />
			</Routes>
		</OnlineStatusProvider>	
		</AuthProvider>
		</BrowserRouter>
	// </React.StrictMode>
);