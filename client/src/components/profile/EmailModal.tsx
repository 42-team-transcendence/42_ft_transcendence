// EmailModal.tsx
import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface EmailModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (newEmail: string) => void;
}

const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const EmailModal: React.FC<EmailModalProps> = ({ open, onClose, onSave }) => {
  const [newEmail, setNewEmail] = useState('');
  const [validEmail, setValidEmail] = useState(true); // Initialize with true


  // const checkEmailExists = async (email: string) => {
  //   try {
  //     // Make a GET request to your backend endpoint to check if the email exists
  //     const response = await axiosPrivate..get(`${API_BASE_URL}/check-email-exists`, {
  //       params: {
  //         email: email,
  //       },
  //     });
  
  //     // If the response status is 200, it means the email exists
  //     return response.status === 200;
  //   } catch (error) {
  //     // Handle any errors that occur during the request (e.g., network error)
  //     console.error('Error checking email existence:', error);
  //     return false; // Return false to indicate an error or unknown status
  //   }
  // };



  const validateEmail = (email: string) => {
    setValidEmail(EMAIL_REGEX.test(email));
  };

  useEffect(() => {
    validateEmail(newEmail);
  }, [newEmail]);

 

  const handleSave = () => {
    console.log({validEmail});
    if (validEmail) {
      onSave(newEmail);
      handleClose();
    }
  };

  const handleClose = () => {
    setNewEmail('');
    onClose();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewEmail(event.target.value);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Change Email</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To update your email address, please enter the new email below.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="email"
          label="New Email Address"
          type="email"
          fullWidth
          variant="standard"
          value={newEmail}
          onChange={handleChange}
          error={!validEmail && newEmail.length > 0}
          helperText={!validEmail && newEmail.length > 0 && "Invalid email"}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} disabled={!validEmail}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailModal;
