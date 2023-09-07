import { useState, useEffect, ChangeEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';
import axios, { axiosPrivate } from '../../api/axios';
import Email from './Email';
import Password from './Password';
import { AxiosError } from 'axios';
import io from 'socket.io-client';
import { Modal, Box, Button } from '@mui/material';

// STYLE =====================================================
import CustomButton from "../../styles/buttons/CustomButton";
import '../../styles/Register_Login.css';


interface TwoFaLoginProps {
    email: string;
    valid2Fa: () => void;
  }

const TwoFaLogin: React.FC<TwoFaLoginProps> = ({
    email,
    valid2Fa,
}) => {

    const [isModalOpen, setIsModalOpen] = useState(true);
    const [currentOTP, setCurrentOTP] = useState('');
    const [isValid, setIsValid] = useState(true); // State to track validation result

    const closeModal = () => {
        setIsModalOpen(false);
    };

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
                email: email,
                otp: currentOTP
            }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });

			      console.log({response})
            if (response.data.isVerified === true) {
                console.log('OTP is valid');
                valid2Fa();
                closeModal();
                return true;
            } else {
                setIsValid(false);
                setCurrentOTP('');
                console.log('Invalid OTP');
                return false;
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            return false;
        }
    };

    return (
        <Modal open={isModalOpen} onClose={closeModal}>
        <Box
          sx={{
            display:'flex',
            flexDirection: 'column',
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
  
          <input type="text" value={currentOTP} onChange={handleOTPInputChange} />
          <Button variant="contained" onClick={validateOTP}>
            Send OTP
          </Button>
          {!isValid ? (
            <p>Invalid OTP. Please try again.</p>
          ) : (
            <p>Please enter your OTP.</p>
          )}
        </Box>
      </Modal>
    )

}

export default TwoFaLogin;
