// NickModal.tsx
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// =============================================================================
// IMPORT COMPONENTS && TYPES ===========================================================
import { statuses, Status } from "../types";
import { MenuItem } from '@mui/material';

export default function StatusModal({ data, open, onClose, onSave }: {
  data:{status:string, pwd:string},
  open:boolean,
  onClose: () => void;
  onSave: (newStatus: string, newPwd: string) => void;
}) {
  const [newStatus, setNewStatus] = useState(data.status);
  const [newPwd, setNewPwd] = useState(data.pwd);
  const [matchPwd, setMatchPwd] = useState<string>('');
  const [validMatch, setValidMatch] = useState<boolean>(false);

  console.log(newStatus)

  useEffect(() => {
    setValidMatch(newPwd === matchPwd);
}, [newPwd, matchPwd])

  const handleSave = () => {
    onSave(newStatus, newPwd);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Change Status</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To update the status or password, please choose below.
        </DialogContentText>

        <TextField
            id="status"
            select
            label="Status"
            name="status"
            value={newStatus}
            helperText="Please select the new status of your channel"
        >
            {statuses.map((st:Status, index) => (
                <MenuItem key={index} value={st} onClick={e => setNewStatus(st)}>{st}</MenuItem>
            ))}
        </TextField>

        {newStatus === 'PROTECTED' && (
          <>
              <TextField
                  required
                  id="pwd"
                  variant="standard"
                  label="Password"
                  name="pwd"
                  autoFocus
                  fullWidth
                  margin="normal"
                  error={!newPwd}
                  value={newPwd}
                  onChange={e => setNewPwd(e.target.value)}
              />

              <TextField
                  required
                  id="matchPwd"
                  variant="standard"
                  label="Validate password"
                  onChange={(e) => setMatchPwd(e.target.value)}
                  value={matchPwd}
                  error={!validMatch}
              />
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          disabled={(newStatus === "PROTECTED" && (!newPwd || !matchPwd || !validMatch)) ? true : false }
        >Save</Button>
      </DialogActions>
    </Dialog>
  );
};
