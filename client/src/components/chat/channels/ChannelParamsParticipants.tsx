import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// =============================================================================
// IMPORT COMPONENTS AND TYPES =================================================
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import tchoupi from '../../../assets/tchoupi50x50.jpg'
import { MiniatureUser } from "../../../utils/types";
import Miniature from "../../miniature/Miniature";

// =============================================================================
// IMPORT STYLES ===============================================================
import {Box, Button, Checkbox, Fab, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Menu, MenuItem,} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SchoolIcon from '@mui/icons-material/School';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import BlockIcon from '@mui/icons-material/Block';

export default function ChannelParamsParticipants(
	{participants, setParticipants, admins, setAdmins, bans,setBans, mutes, setMutes}: {
	participants:any,
	setParticipants:any,
	admins:any,
	setAdmins:any,
	bans:any,
	setBans:any,
	mutes:any,
	setMutes:any
}) {
    const [anchorUserMenu, setAnchorUserMenu] = useState<null | HTMLElement>(null);
    const openUserMenu = Boolean(anchorUserMenu);
	const [userSelected, setUserSelected] = useState()

	const handleClickUserMenu = (event: React.MouseEvent<HTMLElement>, user: any) => {
		setAnchorUserMenu(event.currentTarget);
		setUserSelected(user); // You'll need to define selectedUser state
	  };

	const handleAddAdmin = (newAdmin:any) => {
		if (!admins.find((e:any) => e.id === newAdmin.id))
			setAdmins([...admins, newAdmin]);
		setAnchorUserMenu(null);
    };

	const handleMute = (muted:any) => {
		if (!mutes.find((e:any) => e.id === muted.id))
			setMutes([...mutes, muted]);
		setAnchorUserMenu(null);
    };

	const handleKick = (kicked:any) => {//kick out of participants
		if (participants.find((e:any) => e.id === kicked.id))
			setParticipants(participants.filter((user:any)=> user.id != kicked.id));
		setAnchorUserMenu(null);
    };

	const handleBan = (banned:any) => { //Add to banned list and kick out of chan
		if (!bans.find((e:any) => e.id === banned.id))
			setBans([...bans, banned]);
		handleKick(banned);
    };

	return (
		<List subheader={<ListSubheader>Participants</ListSubheader>}>
		{participants.map((user:any, idx:number) => {
			const miniatureUser: MiniatureUser = {
				nickname: user?.nickname,
				id: user?.id,
				minAvatar: {url: tchoupi, name:'Tchoupi'}
			}
			return (
				<ListItem key={"user_"+idx} disablePadding>
					<Miniature miniatureUser={miniatureUser} ></Miniature>
					<ListItemButton
						id="chan_user_param_button"
						aria-controls={openUserMenu ? 'chan_user_param_menu' : undefined}
						aria-haspopup="true"
						aria-expanded={openUserMenu ? 'true' : undefined}
						onClick={(event) => handleClickUserMenu(event, user)}
					>
						<ListItemText primary={`options`} />
						<KeyboardArrowDownIcon />
					</ListItemButton>
					<Menu
						id="chan_user_param_menu"
						anchorEl={anchorUserMenu}
						open={openUserMenu}
						onClose={() => setAnchorUserMenu(null)}
					>
						<MenuItem onClick={() => handleAddAdmin(userSelected)} disableRipple>
							<SchoolIcon />
							Set admin
						</MenuItem>
						<MenuItem onClick={() => handleMute(userSelected)} disableRipple>
							<VolumeOffIcon />
							Mute
						</MenuItem>
						<MenuItem onClick={() => handleKick(userSelected)} disableRipple>
							<DeleteIcon />
							Kick
						</MenuItem>
						<MenuItem onClick={() => handleBan(userSelected)} disableRipple>
							<BlockIcon />
							Ban
						</MenuItem>
					</Menu>

				</ListItem>
			)})}
	</List>
	)
}
