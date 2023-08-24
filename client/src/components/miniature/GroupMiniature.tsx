import { AvatarGroup } from "@mui/material";
import BadgeAvatar from "./BadgeAvatar";

// =============================================================================
// IMPORT COMPONENTS ===========================================================
import tchoupi from '../../assets/tchoupi50x50.jpg'

export default function GroupMiniature({participants}:{participants:any}) {

	return (
		<AvatarGroup max={3}> {
			participants.map(
				(e:any, idx:number) => <BadgeAvatar key={idx} minAvatar={{url: tchoupi, name:'Tchoupi'}}></BadgeAvatar>
			)
		}
		</AvatarGroup>
	)
}
