import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface PwdModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (newPwd: string) => void;
}

const PwdModal: React.FC<PwdModalProps> = ({ open, onClose, onSave }) => {
  const [newPwd, setNewPwd] = React.useState('');

  const handleSave = () => {
    onSave(newPwd);
    handleClose();
  };

  const handleClose = () => {
    setNewPwd(''); // Reset the email input value when closing the modal
    onClose();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPwd(event.target.value);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Change Password</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To update your password, please enter the new password below.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="password"
          label="New Password"
          type="password"
          fullWidth
          variant="standard"
          value={newPwd}
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

export default PwdModal;
