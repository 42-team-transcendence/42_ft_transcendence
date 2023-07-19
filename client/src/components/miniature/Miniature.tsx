import { Container, Box } from "@mui/material";
import BadgeAvatar from "./BadgeAvatar";

export default function Miniature({nickname}:{nickname:any}) {

    return (
        // sx = "style system." shorthand prop provided by MUI to apply custom styles to components using an inline object syntax.
        // mt={2} sets a top margin of 2 units.
        // mb={4} sets a bottom margin of 4 units.
        // p={3} sets padding of 3 units on all sides (top, right, bottom, left) of the Box component.
        <Container sx={
                { display: 'flex' }
            }> 
            <BadgeAvatar></BadgeAvatar>
            <Box 
                ml={0} mb={0} p={1}
                sx={{ fontWeight: 'bold' }}
            >
                <div>{nickname}</div>
            </Box>
        </Container>
    )
}