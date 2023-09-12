import { AvatarGroup } from "@mui/material";
import BadgeAvatar from "./BadgeAvatar";

// =============================================================================
// IMPORT COMPONENTS ===========================================================

export default function GroupMiniature({participants}:{participants:any}) {

	return (
		<AvatarGroup max={3}> {
			
			participants.map((e:any, idx:number) =>
				<BadgeAvatar key={idx} minAvatar={{url: `http://localhost:3333/public/picture/${e.nickname}`, name: e.nickname}}></BadgeAvatar>
			)
		}
		</AvatarGroup>
	)
}
