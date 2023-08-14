import { Container, Box, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import BadgeAvatar from "./BadgeAvatar";
import type {MiniatureUser} from '../../utils/types'

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
        // sx = "style system." shorthand prop provided by MUI to apply custom styles to components using an inline object syntax.
        // mt={2} sets a top margin of 2 units.
        // mb={4} sets a bottom margin of 4 units.
        // p={3} sets padding of 3 units on all sides (top, right, bottom, left) of the Box component.
        <Button color="secondary" onClick={() => goToUserProfile(miniatureUser)}>
            <Container sx={{ display: 'flex' }}> 
                <BadgeAvatar minAvatar={miniatureUser.minAvatar}></BadgeAvatar>
                <Box 
                    ml={0} mb={0} p={1}
                    sx={{ fontWeight: 'bold' }}
                >
                    <div>{miniatureUser.nickname}</div>
                </Box>
            </Container>
        </Button>
    )
}