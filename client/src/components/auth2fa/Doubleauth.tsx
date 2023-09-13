import React, { useEffect, useState, useContext, ChangeEvent } from 'react';
import QRCodeModal from './QrCodeModal';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import AuthContext from '../../context/AuthProvider';

interface DoubleAuthProps {
    handleSetIsDoubleAuthEnabled: (bool: boolean) => void;
    handleSetDisplay: (bool: boolean) => void;
  }

const DoubleAuth: React.FC<DoubleAuthProps> = ({
    handleSetIsDoubleAuthEnabled,
    handleSetDisplay,
  })=> {
    const { auth } = useContext(AuthContext);
    const [qrCodeData, setQrCodeData] = useState('');
    const axiosPrivate = useAxiosPrivate();

    const [currentOTP, setCurrentOTP] = useState('');

    const enable2FA = async (userEmail: string) => {
        try {
            const response = await axiosPrivate.post('/auth/enable-2fa', { email: userEmail }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
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

    const handleOTPInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setCurrentOTP(event.target.value);
    };

    const validateOTP = async () => {
        if (!currentOTP) {
            console.error('OTP is required.');
            return false;
        }

        try {
            const response = await axiosPrivate.post('/2fa/verify2fa', {
                email: auth.email,
                otp: currentOTP
            }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });

			console.log({response})
            if (response.data.isVerified === true) {
                console.log('OTP is valid');
                return true;
            } else {
                console.log('Invalid OTP');
                return false;
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            return false;
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(true);

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            {/* <h1>Authentication à double facteur</h1>
            <p>Scannez ce QR code avec Google Authenticator :</p>
            {qrCodeData && <img src={qrCodeData} alt="QR Code" />} */}
            <QRCodeModal
                isOpen={isModalOpen}
                onClose={closeModal}
                qrCodeData={qrCodeData}
                currentOTP={currentOTP}
                handleOTPInputChange={handleOTPInputChange}
                validateOTP={validateOTP}
                closeModal={closeModal}
                handleSetIsDoubleAuthEnabled={handleSetIsDoubleAuthEnabled}
                handleSetDisplay={handleSetDisplay}
            />
            {/* <input type="text" value={currentOTP} onChange={handleOTPInputChange} />
            <button onClick={validateOTP}>Valider OTP</button> */}
        </div>
    );
};

export default DoubleAuth;
