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
import {IconButton, List, ListItem, ListItemButton, ListSubheader,} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';




export default function ChannelParamsBans({chatId, bans, setBans, currentUser, admins}: {
	chatId:number,
	bans:any,
	setBans:any,
	currentUser:any
	admins:any
}) {
	const axiosPrivate = useAxiosPrivate();

	const handleDeleteBans = async (event:any, user:any) => {
		if (bans.find((e:any) => e.id === user.id)) {
			try {
                const response = await axiosPrivate.post(
                    `channels/update/${chatId}`,
                    JSON.stringify({ oldBanned: user.id }),{
                        headers: {'Content-Type': 'application/json'}, withCredentials: true
                    }
                );
				setBans(bans.filter((ban:any)=> ban.id != user.id));
            } catch (err: any) {
                console.log(err);
            }
		}
    };

	return (
		<List subheader={<ListSubheader>Banned Users</ListSubheader>}>
			{bans.map((user:any, idx:number) => {
				const miniatureUser: MiniatureUser = {
					nickname: user?.nickname,
					id: user?.id,
					minAvatar: {url: tchoupi, name:'Tchoupi'}
				}
				return (
					<ListItem key={idx} disablePadding>
						<Miniature miniatureUser={miniatureUser} ></Miniature>
						{(user.id != currentUser.id) && admins.find((e:any) => e.id === currentUser.id ) &&
							<ListItemButton onClick={(event)=>handleDeleteBans(event, user)}>
								<IconButton edge="end" aria-label="delete">
									<DeleteIcon />
								</IconButton>
							</ListItemButton>
						}
					</ListItem>
				)})}
		</List>
	)
}
