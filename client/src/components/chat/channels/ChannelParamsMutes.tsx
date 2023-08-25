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




export default function ChannelParamsMutes({mutes, setMutes}: {
	mutes:any,
	setMutes:any,
}) {

	const handleDeleteMutes = (event:any, user:any) => {
		setMutes(mutes.filter((mute:any)=> mute.id != user.id));
    };

	return (
		<List subheader={<ListSubheader>Muted Users</ListSubheader>}>
			{mutes.map((user:any, idx:number) => {
				const miniatureUser: MiniatureUser = {
					nickname: user?.nickname,
					id: user?.id,
					minAvatar: {url: tchoupi, name:'Tchoupi'}
				}
				return (
					<ListItem key={idx} disablePadding>
						<Miniature miniatureUser={miniatureUser} ></Miniature>
						<ListItemButton onClick={(event)=>handleDeleteMutes(event, user)}>
							<IconButton edge="end" aria-label="delete">
								<DeleteIcon />
							</IconButton>
						</ListItemButton>
					</ListItem>
				)})}
		</List>
	)
}
