import React from 'react';
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

const EmailModal: React.FC<EmailModalProps> = ({ open, onClose, onSave }) => {
  const [newEmail, setNewEmail] = React.useState('');

  const handleSave = () => {
    onSave(newEmail);
    handleClose();
  };

  const handleClose = () => {
    setNewEmail(''); // Reset the email input value when closing the modal
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
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailModal;
