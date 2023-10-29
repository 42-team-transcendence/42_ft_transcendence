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
import { MutedUser } from "../../../utils/types/chat";


export default function ChannelParamsMutes({
	chatId,
	channelInfoId,
	mutes,
	setMutes,
	currentUser,
	admins
}: {
	chatId:number,
	channelInfoId:number
	mutes:MutedUser[],
	setMutes:React.Dispatch<React.SetStateAction<MutedUser[]>>,
	currentUser:User,
	admins:User[]
}) {
	const axiosPrivate = useAxiosPrivate();

	const handleDeleteMutes = async (event:any, mute:MutedUser) => {
		if (mutes.find(e => e.userId === mute.userId)) {
			try {
                const response = await axiosPrivate.post(
                    `channels/updateMutes/${chatId}`,
                    JSON.stringify({ oldMuted: mute.userId, channelInfoId }),{
                        headers: {'Content-Type': 'application/json'}, withCredentials: true
                    }
                );
				setMutes(mutes.filter(e => e.userId !== mute.userId));
            } catch (err: any) {
                console.log(err.response);
            }
		}
    };

	return (
		<List subheader={<ListSubheader>Muted Users</ListSubheader>}>
			{mutes.map((mute, idx) => {
				if (new Date(mute.endsAt) < new Date())
					return;

				const miniatureUser: MiniatureUser = {
					nickname: mute?.user?.nickname,
					id: mute?.userId,
					minAvatar: {
                        url: `http://localhost:3333/public/picture/${mute.user.nickname}`,
                        name: mute.user.nickname
                    }
				}
				return (
					<ListItem key={idx} disablePadding>
						<Miniature miniatureUser={miniatureUser} ></Miniature>
						{(mute.userId !== currentUser.id) && admins.find(e => e.id === currentUser.id ) &&
							<ListItemButton onClick={(event)=>handleDeleteMutes(event, mute)}>
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
