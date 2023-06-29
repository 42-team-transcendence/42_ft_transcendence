import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './components/App';
import { AuthProvider } from './context/AuthProvider';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

const container = document.getElementById('root');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Auth0Provider 
			domain={domain!}
			clientId={clientId!}
            authorizationParams={{
                redirect_uri: window.location.origin
            }}
            >
            <AuthProvider>
            <Routes>
                <Route path="/*" element={<App />} />
            </Routes>
        </AuthProvider>
            </Auth0Provider>
        </BrowserRouter>
    </React.StrictMode>
);
