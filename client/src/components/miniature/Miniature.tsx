import { Container, Box, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// =============================================================================
// IMPORT COMPONENTS ===========================================================
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import BadgeAvatar from "./BadgeAvatar";

// =============================================================================
// IMPORT TYPES ================================================================
import type {MiniatureUser} from '../../utils/types'

// =============================================================================
// IMPORT STYLES ===============================================================
import '../../styles/Miniature.css';



// =============================================================================
// FUNCTION ====================================================================

export default function Miniature({miniatureUser}: {miniatureUser: MiniatureUser}) {
	const navigate = useNavigate();
	const location = useLocation();
	const axiosPrivate = useAxiosPrivate();

    const [currentUser, setCurrentUser] = useState<any>();

    useEffect(() => { //Fetch current user data
		const getCurrentUser = async () => {
			try {
        const response = await axiosPrivate.get('/users/me', {
            headers: { 'Content-Type': 'application/json'},
            withCredentials: true
        })
        setCurrentUser(response.data);
			} catch (error:any) {
				console.log(error.response );
			}
		}
		getCurrentUser();
    }, [])

	const goToUserProfile = (user: MiniatureUser) => {
        if (currentUser.id === user.id) //si on se sélectionne soit même on va sur notre profil
            navigate(`/profile`, {replace: false});
        else
            navigate(`/profile/${user.id}`, {replace: false});
    }

    return (
        <Button color="secondary" onClick={() => goToUserProfile(miniatureUser)}>
		   <div className="miniature-infos">
                <BadgeAvatar minAvatar={miniatureUser.minAvatar}/>
                <div className="miniature-name">{miniatureUser.nickname}</div>
			</div>
        </Button>
    )
}