// =============================================================================
// IMPORT COMPONENTS AND TYPES =================================================
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { MiniatureUser } from "../../../utils/types";
import Miniature from "../../miniature/Miniature";

// =============================================================================
// IMPORT STYLES ===============================================================
import {IconButton, List, ListItem, ListItemButton, ListSubheader,} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { User } from "../../../utils/types/user";




export default function ChannelParamsBans({chatId, bans, setBans, currentUser, admins}: {
	chatId:number,
	bans:User[],
	setBans:React.Dispatch<React.SetStateAction<User[]>>,
	currentUser:User
	admins:User[]
}) {
	const axiosPrivate = useAxiosPrivate();

	const handleDeleteBans = async (event:any, user:User) => {
		if (bans.find(e => e.id === user.id)) {
			try {
                const response = await axiosPrivate.post(
                    `channels/update/${chatId}`,
                    JSON.stringify({ oldBanned: user.id }),{
                        headers: {'Content-Type': 'application/json'}, withCredentials: true
                    }
                );
				setBans(bans.filter(ban => ban.id !== user.id));
            } catch (err: any) {
                console.log(err.response);
            }
		}
    };

	return (
		<List subheader={<ListSubheader>Banned Users</ListSubheader>}>
			{bans.map((user:User, idx:number) => {
				const miniatureUser: MiniatureUser = {
					nickname: user?.nickname,
					id: user?.id,
					minAvatar: {
                        url: `http://localhost:3333/public/picture/${user.nickname}`,
                        name: user.nickname
                    }
				}
				return (
					<ListItem key={idx} disablePadding>
						<Miniature miniatureUser={miniatureUser} ></Miniature>
						{(user.id !== currentUser.id) && admins.find(e => e.id === currentUser.id ) &&
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
