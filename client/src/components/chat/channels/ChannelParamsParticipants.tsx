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

export default function ChannelParamsParticipants({participants}: {participants:any}) {
    const [anchorUserMenu, setAnchorUserMenu] = useState<null | HTMLElement>(null);
    const openUserMenu = Boolean(anchorUserMenu);


    const handleClickUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorUserMenu(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorUserMenu(null);
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
				<ListItem key={idx} disablePadding>
					<Miniature miniatureUser={miniatureUser} ></Miniature>
					<ListItemButton
						id="chan_user_param_button"
						aria-controls={openUserMenu ? 'chan_user_param_menu' : undefined}
						aria-haspopup="true"
						aria-expanded={openUserMenu ? 'true' : undefined}
						onClick={handleClickUserMenu}
					>
						<ListItemText primary={`options`} />
						<KeyboardArrowDownIcon />
					</ListItemButton>
					<Menu
						id="chan_user_param_menu"
						anchorEl={anchorUserMenu}
						open={openUserMenu}
						onClose={handleCloseUserMenu}
					>
						<MenuItem onClick={handleCloseUserMenu} disableRipple>
							<SchoolIcon />
							Set admin
						</MenuItem>
						<MenuItem onClick={handleCloseUserMenu} disableRipple>
							<VolumeOffIcon />
							Mute
						</MenuItem>
						<MenuItem onClick={handleCloseUserMenu} disableRipple>
							<DeleteIcon />
							Kick
						</MenuItem>
						<MenuItem onClick={handleCloseUserMenu} disableRipple>
							<BlockIcon />
							Ban
						</MenuItem>
					</Menu>

				</ListItem>
			)})}
	</List>
	)
}
