import { useState } from "react";
import {  useNavigate } from "react-router-dom";

// =============================================================================
// IMPORT COMPONENTS AND TYPES =================================================
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { MiniatureUser } from "../../../utils/types";
import Miniature from "../../miniature/Miniature";

// =============================================================================
// IMPORT STYLES ===============================================================
import {IconButton, List, ListItem, ListItemButton, ListSubheader, Menu, MenuItem,} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SchoolIcon from '@mui/icons-material/School';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import BlockIcon from '@mui/icons-material/Block';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ClearIcon from '@mui/icons-material/Clear';


export default function ChannelParamsParticipants(
	{chatId,channelInfoId,  participants, setParticipants, admins, setAdmins, bans,setBans, mutes, setMutes, ownerId, currentUser}: {
	chatId:number,
	channelInfoId:number,
	participants:any,
	setParticipants:any,
	admins:any,
	setAdmins:any,
	bans:any,
	setBans:any,
	mutes:any,
	setMutes:any,
	ownerId:number,
	currentUser:any
}) {
	const navigate = useNavigate();
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
                console.log(err.response);
            }
		}
		setAnchorUserMenu(null);
    };

	const handleMute = async (muted:any) => {//Can mute multiple times same user, adds muted time in DB
		try {
			const response = await axiosPrivate.post(
				`channels/updateMutes/${chatId}`,
				JSON.stringify({ newMuted: muted.id, channelInfoId }), {
					headers: {'Content-Type': 'application/json'}, withCredentials: true
				}
			);
			const newMuted = response.data.mutedUsers.find((e:any)=>e.userId === muted.id);
			setMutes([...mutes, newMuted]);
		} catch (err: any) {
			console.log(err.response);
		}
		setAnchorUserMenu(null);
    };

	const eraseData = (userId: number) => {
		let erase : {admin: null | number, mute: null | number} = {admin: null, mute: null};
		if (admins.find((e:any) => e.id === userId)) {
			erase.admin = userId;
			setAdmins(admins.filter((e:any)=> userId !== e.id));
		}
		if (mutes.find((e:any) => e.userId === userId)) {
			erase.mute = userId;
			setMutes(mutes.filter((e:any)=> userId !== e.userId));
		}
		return erase;
	}

	const handleKick = async (kicked:any, ban:boolean) => {//kick out of participants
		if (participants.find((e:any) => e.id === kicked.id)) {
			try {
				//if user is kicked, also need to strip of admins and mutes
				let erase = eraseData(kicked.id);
				const response = await axiosPrivate.post(`channels/update/${chatId}`,
                    JSON.stringify({
						oldParticipant: kicked.id,
						newBanned:  ban? kicked.id: null,
						oldAdmin: erase.admin,
					}),{headers: {'Content-Type': 'application/json'}, withCredentials: true}
                );
				setParticipants(participants.filter((user:any)=> user.id !== kicked.id));

				if (erase.mute) {
					const eraseMute = await axiosPrivate.post(
						`channels/updateMutes/${chatId}`,
						JSON.stringify({oldMuted: erase.mute, channelInfoId}),
						{headers: {'Content-Type': 'application/json'}, withCredentials: true}
					);
				}
            } catch (err: any) {
                console.log(err.response);
            }
		}
		setAnchorUserMenu(null);
    };

	const handleLeave = async () => {//leave this channel
		if (participants.find((e:any) => e.id === currentUser.id)) {
			try {
				//if user leaves, also need to strip of admins and mutes
				let erase = eraseData(currentUser.id);
                const response = await axiosPrivate.post(`channels/leave/${chatId}`,
                    JSON.stringify({
						oldParticipant: currentUser.id,
						oldAdmin: erase.admin,
					}),{headers: {'Content-Type': 'application/json'}, withCredentials: true}
                );
				setParticipants(participants.filter((user:any)=> user.id !== currentUser.id));
				
				if (erase.mute) {
					const eraseMute = await axiosPrivate.post(
						`channels/updateMutes/${chatId}`,
						JSON.stringify({oldMuted: erase.mute, channelInfoId}),
						{headers: {'Content-Type': 'application/json'}, withCredentials: true}
					);
				}
				navigate('/chat');
            } catch (err: any) {
                console.log(err.response);
            }
		}
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
				minAvatar: {
					url: `http://localhost:3333/public/picture/${user.nickname}`,
					name: user.nickname
				}
			}
			return (
				<ListItem key={"user_"+idx} disablePadding>
					<Miniature miniatureUser={miniatureUser} ></Miniature>
					{user.id !== currentUser.id ? (
						admins.find((e:any) => e.id === currentUser.id ) && user.id !== ownerId &&
						<>
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
						</>
					): (
						user.id !== ownerId && <ListItemButton onClick={handleLeave}>
							<IconButton edge="end" aria-label="delete">
								<DeleteIcon />
							</IconButton>
						</ListItemButton>
					)}
				</ListItem>
			)})}
	</List>
	)
}
