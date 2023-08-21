import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// =============================================================================
// IMPORT COMPONENTS ===========================================================
import Conversation from "./Conversation";
import ChatSidebar from "./ChatSidebar";
import PageWrapper from "../navbar/pageWrapper";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

// =============================================================================
// IMPORT STYLES ===============================================================
import {Box, Button, FormHelperText, MenuItem, TextField} from '@mui/material';
import '../../styles/ChatChannel.css';


// =============================================================================
// FUNCTION ====================================================================

const CHANNEL_CREATION_ROUTE = '/channel/create';

export default function ChannelCreation() {
	const axiosPrivate = useAxiosPrivate();
	const navigate = useNavigate();

    const [errMsg, setErrMsg] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [nameErrorText, setNameErrorText] = useState<string>('');
    

    const statuses = ["public", "private", "protected"];

    useEffect(() => {
        setErrMsg('');
    }, [])

	const handleSubmit = async (e: React.FormEvent) => {
		console.log("channel creation form submitted")
		e.preventDefault();
        if (!name) {
            setNameErrorText("Please enter name");
        } else {
            setNameErrorText("");
        }
        // try {
        //     const response = await axiosPrivate.post(
        //         CHANNEL_CREATION_ROUTE,
        //         JSON.stringify({ name:"test", status: "public", password: ""}),
        //         {
        //             headers: {'Content-Type': 'application/json'},
        //             withCredentials: true
        //         }
		// 	);
		// 	console.log(response.data);
        //     navigate('/chat', { replace: false});
        // } catch (err: any) {
        //     if (!err?.response) {
        //         setErrMsg('No Server Response');
        //     } else if (err.response) {
        //         setErrMsg('Channel creation failed');
        //         console.log(err);
        //     }
        // }
	}

    return (
        <section className="channel-params-form">
            <p className={errMsg? "errmsg" : "offscreen"}>
                {errMsg}
            </p>

				<Box component="form" onSubmit={handleSubmit}
					sx={{
                        display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						'& .MuiTextField-root': { m: 1, width: '25ch' },
					}}
				>
				<TextField
					required
					id="name"
					label="Name"
                    name="name"
                    autoFocus
                    fullWidth
                    margin="normal"
                    error={!name}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    aria-describedby="component-error-text"
				/>
                <FormHelperText id="component-error-text">{nameErrorText}</FormHelperText>

                <TextField
                    id="status"
                    select
                    label="Status"
                    name="status"
                    defaultValue="public"
                    helperText="Please select the status of your channel"
                    >
                    {statuses.map((option:string, index) => (
                        <MenuItem key={index} value={option}>
                        {option}
                        </MenuItem>
                    ))}
                </TextField>

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                >Create channel</Button>

				</Box>
        </section>
    )


}
