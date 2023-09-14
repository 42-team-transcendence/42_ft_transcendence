// =============================================================================
// IMPORT COMPONENTS AND TYPES =================================================
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { MiniatureUser } from "../../../utils/types";
import Miniature from "../../miniature/Miniature";

// =============================================================================
// IMPORT STYLES ===============================================================
import {IconButton, List, ListItem, ListItemButton, ListSubheader,} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';


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
	mutes:any,
	setMutes:any,
	currentUser:any,
	admins:any
}) {
	const axiosPrivate = useAxiosPrivate();

	const handleDeleteMutes = async (event:any, mute:any) => {
		if (mutes.find((e:any) => e.userId === mute.userId)) {
			try {
                const response = await axiosPrivate.post(
                    `channels/updateMutes/${chatId}`,
                    JSON.stringify({ oldMuted: mute.userId, channelInfoId }),{
                        headers: {'Content-Type': 'application/json'}, withCredentials: true
                    }
                );
				setMutes(mutes.filter((e:any)=> e.userId !== mute.userId));
            } catch (err: any) {
                console.log(err.response);
            }
		}
    };

	return (
		<List subheader={<ListSubheader>Muted Users</ListSubheader>}>
			{mutes.map((mute:any, idx:number) => {
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
						{(mute.userId !== currentUser.id) && admins.find((e:any) => e.id === currentUser.id ) &&
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
