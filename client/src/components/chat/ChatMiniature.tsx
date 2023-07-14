import { Container, Box } from "@mui/material";
import Miniature from "../miniature/Miniature";

export default function ChatMiniature() {

    return (
        <Box sx={{
                backgroundColor: 'white',
                border: '1px solid black',
                borderRadius: '10px'
            }}
            pt={1} pb={1}
        >
            <Miniature></Miniature>
            {/* margin left margin top */}
            <Box ml={0} mt={0}>
                <div>blah blah blah</div>
            </Box>
        </Box>
    )
}