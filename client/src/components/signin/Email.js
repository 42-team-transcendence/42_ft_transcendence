import TextField from '@mui/material/TextField';

function Email ({ stateEmail, fonctionUpdateEmail}) {

  const {email}  = stateEmail;
   const {updateEmail} = fonctionUpdateEmail;

    // const emailRef = useRef();

    //     useEffect(() => {
    //     emailRef.current.focus();
    // }, [])

    return (
		<>
			<TextField
				required
				id="email"
				variant="standard"
				label="email"
				autoComplete="off"
				onChange={(e) => updateEmail(e.target.value)}
				value={email}
			/>
		</>
    )
}

export default Email;