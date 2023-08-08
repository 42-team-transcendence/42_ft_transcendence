// NickModal.tsx
import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface NickModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (newNick: string) => void;
}

const NICK_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;

const NickModal: React.FC<NickModalProps> = ({ open, onClose, onSave }) => {
  const [newNick, setNewNick] = useState('');
  const [validNick, setValidNick] = useState(true); // Initialize with true

  const validateNick = (Nick: string) => {
    setValidNick(NICK_REGEX.test(Nick));
  };

  useEffect(() => {
    validateNick(newNick);
  }, [newNick]);

  const handleSave = () => {
    if (validNick) {
      onSave(newNick);
      handleClose();
    }
  };

  const handleClose = () => {
    setNewNick('');
    onClose();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewNick(event.target.value);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Change Nick</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To update your Nickname, please enter the new Nickname below.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="Nickname"
          label="New Nickname "
          type="Nickname"
          fullWidth
          variant="standard"
          value={newNick}
          onChange={handleChange}
          error={!validNick && newNick.length > 0}
          helperText={!validNick && newNick.length > 0 && "Invalid Nick"}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} disabled={!validNick}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default NickModal;
