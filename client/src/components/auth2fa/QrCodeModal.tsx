import React, { useEffect, useState } from 'react';
import { Modal, Box, Button } from '@mui/material';
import QRCode from 'qrcode.react';




	// =============================================================================
	// 2FA MODAL ===================================================================
	// const [is2fa, setIs2fa] = useState(user?.auth2fa || false);


	// const handle2fa = () => {
	// 	const new2faState = !is2fa; // Toggle the state
	// 	setIs2fa(new2faState);
	  
	// 	// Save the new 2FA state to your backend
	// 	save2faState(new2faState); // Call a function to save the state
	// };

	// const save2faState = async (new2faState: boolean) => {
	// 	try {
	// 		const response = await axiosPrivate.post(
	// 			'/users/update2fa',
	// 			JSON.stringify({ auth2fa: new2faState }),
	// 			{
	// 				headers: { "Content-Type": "application/json" },
	// 				withCredentials: true,
	// 			}
	// 		);
		
	// 		if (response.status === 200) {
	// 			console.log('2FA state update successful');
	// 			setUser((prevUser) => ({...prevUser, auth2fa: new2faState}))
	// 		} else {
	// 			console.error('2FA state update failed');
	// 		}
	// 	} catch (error) {
	// 	  	console.error('Error updating 2FA state:', error);
	// 	}
	// };
	






interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCodeData: string;
  currentOTP: string;
  handleOTPInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  validateOTP: () => Promise<boolean>;
  closeModal: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  qrCodeData,
  currentOTP,
  handleOTPInputChange,
  validateOTP,
  closeModal,
}) => {
  const [isValid, setIsValid] = useState(false); // State to track validation result

  const handleSendOTPClick = () => {
    // Call validateOTP when the user clicks the "Send OTP" button
    validateOTP()
      .then((result) => {
        setIsValid(result);
        if (result) {
            // If OTP is valid, close the modal
            closeModal();
      }
    })
      .catch((error) => console.error('Error verifying OTP:', error));
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '20px',
          textAlign: 'center',
          boxShadow: 24,
          borderRadius: '5px',
        }}
      >

        <h2>Scan QR Code</h2>
        {qrCodeData ? (
          <img src={qrCodeData} alt="QR Code" />
        ) : (
          <p>No QR code data available.</p>
        )}
        <input type="text" value={currentOTP} onChange={handleOTPInputChange} />
        <Button variant="contained" onClick={handleSendOTPClick}>
          Send OTP
        </Button>
        {isValid ? (
          <p>OTP is valid. Authentication successful.</p>
        ) : (
          <p>Invalid OTP. Please try again.</p>
        )}
      </Box>
    </Modal>
  );
};

export default QRCodeModal;
