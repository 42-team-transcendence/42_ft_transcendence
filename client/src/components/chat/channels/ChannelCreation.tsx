import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// =============================================================================
// IMPORT COMPONENTS ===========================================================
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import PageWrapper from "../../navbar/pageWrapper";

import { statuses, Status } from "../types";

// =============================================================================
// IMPORT STYLES ===============================================================
import {Box, Button, FormHelperText, MenuItem, TextField} from '@mui/material';
import "../../../styles/chat/ChanCreationParam.css"

// =============================================================================
// FUNCTION ====================================================================

const CHANNEL_CREATION_ROUTE = '/channels/create';

export default function ChannelCreation() {
	const axiosPrivate = useAxiosPrivate();
	const navigate = useNavigate();

    const [errMsg, setErrMsg] = useState<string>('');

    const [name, setName] = useState<string>('');
    const [nameErrorText, setNameErrorText] = useState<string>('');

    const [status, setStatus] = useState<Status>('PUBLIC');

    const [pwd, setPwd] = useState<string>('');
    const [matchPwd, setMatchPwd] = useState<string>('');
    const [validMatch, setValidMatch] = useState<boolean>(false);


    useEffect(() => {
        setErrMsg('');
    }, [])

    useEffect(() => {
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
        if (!name) {
            setNameErrorText("Please enter name");
        } else {
            setNameErrorText("");
        }
        try {
            console.log({pwd});
            const response = await axiosPrivate.post(
                CHANNEL_CREATION_ROUTE,
                JSON.stringify({ name, status, password: pwd}),
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                }
			);
			console.log(response.data);
            navigate('/chat', { replace: false});
        } catch (err: any) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response) {
                setErrMsg('Channel creation failed');
                console.log(err);
            }
        }
	}

    return (
        <PageWrapper>
        <section className="chan-creation-param-container">
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
                    variant="standard"
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
                    defaultValue="PUBLIC"
                    helperText="Please select the status of your channel"
                >
                    {statuses.map((st:Status, index) => (
                        <MenuItem key={index} value={st} onClick={e => setStatus(st)}>{st}</MenuItem>
                    ))}
                </TextField>

                {status === 'PROTECTED' && (
                    <>
                        <TextField
                            required
                            id="pwd"
                            variant="standard"
                            label="Password"
                            name="pwd"
                            autoFocus
                            fullWidth
                            margin="normal"
                            error={!pwd}
                            value={pwd}
                            onChange={e => setPwd(e.target.value)}
                        />

                        <TextField
                            required
                            id="matchPwd"
                            variant="standard"
                            label="Validate password"
                            autoComplete="off"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            value={matchPwd}
                            error={!validMatch}
                            // helperText={
                            //     !validPwd && pwd.length > 0 &&  (
                            //         <>	error </>
                            //     )
                            // }
                        />
                    </>
                )}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={!name || (status === "PROTECTED" && (!pwd || !matchPwd || !validMatch)) ? true : false }
                >Create channel
                </Button>

				</Box>
        </section>
        </PageWrapper>
    )


}
