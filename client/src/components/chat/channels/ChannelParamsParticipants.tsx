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
import {List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Menu, MenuItem,} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SchoolIcon from '@mui/icons-material/School';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import BlockIcon from '@mui/icons-material/Block';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ClearIcon from '@mui/icons-material/Clear';


export default function ChannelParamsParticipants(
	{chatId, participants, setParticipants, admins, setAdmins, bans,setBans, mutes, setMutes, owner, setOwner}: {
	chatId:number
	participants:any,
	setParticipants:any,
	admins:any,
	setAdmins:any,
	bans:any,
	setBans:any,
	mutes:any,
	setMutes:any,
	owner:any,
	setOwner:any
}) {
	const axiosPrivate = useAxiosPrivate();

    const [anchorUserMenu, setAnchorUserMenu] = useState<null | HTMLElement>(null);
    const openUserMenu = Boolean(anchorUserMenu);
	const [userSelected, setUserSelected] = useState()

	const handleClickUserMenu = (event: React.MouseEvent<HTMLElement>, user: any) => {
		setAnchorUserMenu(event.currentTarget);
		setUserSelected(user); // define selectedUser state
	  };

	const handleAddAdmin = async (newAdmin:any) => {
		if (!admins.find((e:any) => e.id === newAdmin.id)) {
			try {
                const response = await axiosPrivate.post(
                    `channels/update/${chatId}`,
                    JSON.stringify({ newAdmin: newAdmin.id }),{
                        headers: {'Content-Type': 'application/json'}, withCredentials: true
                    }
                );
                setAdmins([...admins, newAdmin]);
            } catch (err: any) {
                console.log(err);
            }
		}
		setAnchorUserMenu(null);
    };

	const handleMute = async (muted:any) => {
		if (!mutes.find((e:any) => e.id === muted.id)) {
			try {
                const response = await axiosPrivate.post(
                    `channels/update/${chatId}`,
                    JSON.stringify({ newMuted: muted.id }),{
                        headers: {'Content-Type': 'application/json'}, withCredentials: true
                    }
                );
				setMutes([...mutes, muted]);
            } catch (err: any) {
                console.log(err);
            }
		}
		setAnchorUserMenu(null);
    };

	const handleKick = async (kicked:any, ban:boolean) => {//kick out of participants
		if (participants.find((e:any) => e.id === kicked.id)) {
			try {
				//if user is kicked, also need to strip of admins and mutes
				let erase = {admin: null, mute: null };
				if (admins.find((e:any) => e.id === kicked.id)) {
					erase.admin = kicked.id;
					setAdmins(admins.filter((user:any)=> kicked.id != user.id));
				}
				if (mutes.find((e:any) => e.id === kicked.id)) {
					erase.mute = kicked.id;
					setMutes(mutes.filter((user:any)=> kicked.id != user.id));
				}
                const response = await axiosPrivate.post(
                    `channels/update/${chatId}`,
                    JSON.stringify({
						oldParticipant: kicked.id,
						newBanned:  ban? kicked.id: null,
						oldAdmin: erase.admin,
						oldMuted: erase.mute,
					}),{
                        headers: {'Content-Type': 'application/json'}, withCredentials: true
                    }
                );
				setParticipants(participants.filter((user:any)=> user.id != kicked.id));

            } catch (err: any) {
                console.log(err);
            }
		}
		setAnchorUserMenu(null);
    };

	const handleBan = (banned:any) => { //Add to banned list and kick out of chan
		if (!bans.find((e:any) => e.id === banned.id)) {
			handleKick(banned, true);
			setBans([...bans, banned]);
		} else
			handleKick(banned, false);
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
						<MoreVertIcon />
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
						<MenuItem onClick={() => handleKick(userSelected, false)} disableRipple>
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
