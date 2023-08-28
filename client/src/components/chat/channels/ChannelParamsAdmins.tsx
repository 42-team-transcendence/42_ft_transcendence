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
import {IconButton, List, ListItem, ListItemButton, ListItemText, ListSubheader,} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ChannelParamsParticipants({chatId, admins, setAdmins, ownerId, currentUser}: {
	chatId:number,
	admins:any,
	setAdmins:any,
	ownerId:number,
	currentUser:any
}) {
	const axiosPrivate = useAxiosPrivate();

	const handleDeleteAdmin = async (event:any, user:any) => {
		if (admins.find((e:any) => e.id === user.id)) {
			try {
                const response = await axiosPrivate.post(
                    `channels/update/${chatId}`,
                    JSON.stringify({ oldAdmin: user.id }),{
                        headers: {'Content-Type': 'application/json'}, withCredentials: true
                    }
                );
                console.log('saveNameInDb', response.data);
				setAdmins(admins.filter((admin:any)=> admin.id != user.id));
            } catch (err: any) {
                console.log(err);
            }
		}
    };

	return (
		<List subheader={<ListSubheader>Admins</ListSubheader>}>
			{admins.map((user:any, idx:number) => {
				const miniatureUser: MiniatureUser = {
					nickname: user?.nickname,
					id: user?.id,
					minAvatar: {url: tchoupi, name:'Tchoupi'}
				}
				return (
					<ListItem key={idx} disablePadding>
						<Miniature miniatureUser={miniatureUser} ></Miniature>
						{(user.id != ownerId) ? (
							<ListItemButton onClick={(event)=>handleDeleteAdmin(event, user)}>
								<IconButton edge="end" aria-label="delete">
									<DeleteIcon />
								</IconButton>
							</ListItemButton>) : (
							<ListItemText primary="Owner" />
							)
						}
					</ListItem>
				)})}
		</List>
	)
}
