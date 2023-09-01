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
import { MenuItem } from '@mui/material';

export default function SearchChanPwdModal({ channelId, channelPwd, open, onClose, onSave }: {
	channelId:number,
	channelPwd:string,
	open:boolean,
	onClose: () => void;
	onSave: (inputPwd: string, channelPwd: string, channelId:number) => any;
}) {
	const [inputPwd, setInputPwd] = useState<string>('');

	const handleSave = () => {
		onSave(inputPwd, channelPwd, channelId);
		onClose();
	};

	return (
	<Dialog open={open} onClose={onClose}>
		<DialogTitle>Enter password</DialogTitle>
		<DialogContent>
		<DialogContentText>Channel is protected. Please enter password below</DialogContentText>
			<TextField
				required
				id="pwd"
				variant="standard"
				label="Password"
				name="pwd"
				autoFocus
				fullWidth
				margin="normal"
				onChange={e => setInputPwd(e.target.value)}
			/>
		</DialogContent>

		<DialogActions>
		<Button onClick={onClose}>Cancel</Button>
		<Button
			onClick={handleSave}
			disabled={!inputPwd ? true : false }
		>Save</Button>
		</DialogActions>
	</Dialog>
	);
};
