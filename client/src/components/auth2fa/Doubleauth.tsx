import React, { useEffect, useState, useContext } from 'react';
import QRCode from 'qrcode.react';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import AuthContext, { AuthProvider } from '../../context/AuthProvider';
// STYLE =====================================================




// =============================================================================
// =============================================================================
const DoubleAuth = () => {
	const { auth } = useContext(AuthContext);
	const [qrCodeData, setQrCodeData] = useState('');
	const axiosPrivate = useAxiosPrivate();

	const enable2FA = async (userEmail: string) => {
		try {
			const response = await axiosPrivate.post('/auth/enable-2fa', { email: userEmail }, {
				headers: { 'Content-Type': 'application/json'},
				withCredentials: true
			})
			console.log(response)
			if (response.status === 201) {
				setQrCodeData(response.data.qrCodeData);
			} else {
				console.error('Error enabling 2FA:', response);
			}
		} catch (error) {
			console.error('Error enabling 2FA:', error);
		}
	};

	useEffect(() => {
		if (auth.email) {
			enable2FA(auth.email);
		}
	}, [auth.email]);

	console.log(`Auth email = ${auth.email}`)



	// Render the QR code and other components
	return (
		<div>
		<h1>Authentification à double facteur</h1>
		<p>Scannez ce QR code avec Google Authenticator :</p>
		{qrCodeData && <img src={qrCodeData} alt="QR Code" />}
		</div>
	);
};

export default DoubleAuth;