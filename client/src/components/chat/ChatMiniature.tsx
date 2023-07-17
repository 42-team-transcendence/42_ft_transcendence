import { Container, Box } from "@mui/material";
import Miniature from "../miniature/Miniature";

export default function ChatMiniature({notif}:{notif:boolean}) {

    return (
        <Box sx={{
                backgroundColor: notif ? 'white' : '#00000021',
                border: notif ? '2px solid black' : 'none',
                borderRadius: '10px'
            }}
            mt={3} pt={1} pb={1}
        >
            <Miniature></Miniature>
            {/* margin left margin top */}
            <Box ml={0} mt={0}>
                <div>blah blah blah</div>
            </Box>
        </Box>
    )
}