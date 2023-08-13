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
			const response = await axiosPrivate.post('/auth/enable-2fa', { email: auth.email });

			if (response.status === 200) {
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
	}, [auth.email, enable2FA]);

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


// import React, { useEffect, useState } from 'react';
// import * as speakeasy from 'speakeasy';
// import * as qrcode from 'qrcode';

// function DoubleAuth(): JSX.Element {
//   const [qrCodeData, setQrCodeData] = useState<string>(''); // Assurez-vous que qrCodeData est de type 'string'

//   useEffect(() => {
//     // Générer le secret et le code OTP
//     var secret = speakeasy.generateSecret({
//       name: 'WeAreDevs',
//     });

//     // Générer le QR code
//     qrcode.toDataURL(secret.otpauth_url, function (err: Error | null, data: string | undefined) {
//       if (err) {
//         console.error('Erreur lors de la génération du QR code:', err);
//       } else if (data) { // Assurez-vous que data est défini avant de le définir dans le state
//         setQrCodeData(data);
//       }
//     });
//   }, []);

//   return (
//     <div>
//       <h1>Authentification à double facteur</h1>
//       <p>Scannez ce QR code avec une application d'authentification :</p>
//       {qrCodeData && <img src={qrCodeData} alt="QR Code" />}
//       {/* Vous pouvez également afficher ici le secret pour l'enregistrer manuellement */}
//     </div>
//   );
// }

// export default DoubleAuth;
