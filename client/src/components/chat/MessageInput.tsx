import { TextField, Box, Fab } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { useState } from "react";

export default function MessageInput({send} : {send: (val:string) => void}) {
    const [value, setValue] = useState("");

    const sendClearInput = () => {
        send(value);
        setValue("");
    }

    return (
        <Box sx={{display:'flex', alignItems:'center', justifyContent: 'space-around'}}>
            <TextField 
                id="outlined-basic-email" label="Type your message"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter'? sendClearInput(): "undefined"}
            />
            <Fab //MUI floating action button
                size="small" color="primary" aria-label="add"
                onClick={() => sendClearInput()}
            ><SendIcon /></Fab>
        </Box>
    )
}