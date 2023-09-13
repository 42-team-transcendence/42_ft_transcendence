import React, { useEffect, useState } from 'react';
import { Modal, Box, Button } from '@mui/material';
import QRCode from 'qrcode.react';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";



	// =============================================================================
	// 2FA MODAL ===================================================================




interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCodeData: string;
  currentOTP: string;
  handleOTPInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  validateOTP: () => Promise<boolean>;
  closeModal: () => void;
  handleSetIsDoubleAuthEnabled: (bool: boolean) => void;
  handleSetDisplay: (bool: boolean) => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  qrCodeData,
  currentOTP,
  handleOTPInputChange,
  validateOTP,
  closeModal,
  handleSetIsDoubleAuthEnabled,
  handleSetDisplay,
}) => {

  const axiosPrivate = useAxiosPrivate();
  const [isValid, setIsValid] = useState(false); // State to track validation result

  const save2faState = async (new2faState: boolean) => {

      try {
        const response = await axiosPrivate.post(
          '/users/update2fa',
          JSON.stringify({ auth2fa: new2faState }),
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        if (response.status === 200) {
        } else {
          console.error('2FA state update failed');
        }
      } catch (error) {
          console.error('Error updating 2FA state:', error);
      }
    };

  const handleSendOTPClick = () => {
    // Call validateOTP when the user clicks the "Send OTP" button
    validateOTP()
      .then((result) => {
        setIsValid(result);
        handleSetDisplay(result);
        if (result) {
          save2faState(true);
            // If OTP is valid, close the modal
            closeModal();
      }
    })
      .catch((error) => console.error('Error verifying OTP:', error));
  };


  return (
    <Modal open={isOpen} onClose={(event, reason) => {
      if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
        handleSetIsDoubleAuthEnabled(false);
        onClose();
      }
    }}>
      <Box
        sx={{
          display:'flex',
          flexDirection:'column',
          position: 'absolute',
          gap:'20px',
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
