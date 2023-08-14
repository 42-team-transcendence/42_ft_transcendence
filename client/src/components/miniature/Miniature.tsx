import { Container, Box } from "@mui/material";
import BadgeAvatar from "./BadgeAvatar";

import type {MiniAvatarPicture} from '../../utils/types'
import  "../../styles/Miniature.css";


export default function Miniature({nickname, minAvatar}:{nickname:string, minAvatar:MiniAvatarPicture}) {

    return (
		<div className="miniature-infos">
        	<BadgeAvatar minAvatar={minAvatar}></BadgeAvatar>
            <div className="miniature-name">{nickname}</div>
		</div>
   
    )
}