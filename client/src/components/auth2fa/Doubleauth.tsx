
import React, { useEffect, useState, useContext, ChangeEvent } from 'react';
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

  	const [currentOTP, setCurrentOTP] = useState('');

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

	const handleOTPInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		setCurrentOTP(event.target.value);
	};
	
	const validateOTP = async () => {
		console.log(`current OTP = ${currentOTP}`)
		if (!currentOTP) {
			console.error('OTP is required.');
			return;
		}
	
		try {
			const response = await axiosPrivate.post('/2fa/verify2fa', {
				email: auth.email,
				otp: currentOTP
			}, {
				headers: { 'Content-Type': 'application/json'},
				withCredentials: true
			});
		
			if (response.status === 200) {
				console.log('OTP is valid');
				// Perform further actions here (e.g., authentication)
			} else {
				console.log('Invalid OTP');
			}
		} catch (error) {
		  	console.error('Error verifying OTP:', error);
		}
	};


	// Render the QR code and other components
	return (
		<div>
		<h1>Authentification à double facteur</h1>
		<p>Scannez ce QR code avec Google Authenticator :</p>
		{qrCodeData && <img src={qrCodeData} alt="QR Code" />}
		<input type="text" value={currentOTP} onChange={handleOTPInputChange} />
      	<button onClick={validateOTP}>Validate OTP</button>
 
		</div>
	);
};

export default DoubleAuth;