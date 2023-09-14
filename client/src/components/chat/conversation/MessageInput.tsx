import { useState } from "react";

// =============================================================================
// IMPORT STYLES ===============================================================
import { TextField, Fab } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import '../../../styles/chat/MessageInput.css'



// =============================================================================
// FUNCTION ====================================================================

export default function MessageInput({send} : {send: (val:string) => void}) {
    const [value, setValue] = useState("");

    const sendClearInput = () => {
        send(value);
        setValue("");
    }

    return (
		<div className="message-input">
            <TextField
				className="text-field"
                id="outlined-basic-email" label="Type your message"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && value ? sendClearInput(): "undefined"}
            />
            <Fab //MUI floating action button
                size="small" color="primary" aria-label="add" disabled={value? false : true}
                onClick={() => sendClearInput()}
            ><SendIcon /></Fab>
		</div>

    )
}
