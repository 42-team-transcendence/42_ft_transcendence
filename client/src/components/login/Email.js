import { useRef, useEffect } from 'react';

function Email ({ stateEmail, fonctionUpdateEmail}) {

  const {email}  = stateEmail;
   const {updateEmail} = fonctionUpdateEmail;

    const emailRef = useRef();

        useEffect(() => {
        emailRef.current.focus();
    }, [])

    return (
        <>
            <label htmlFor="email">Email:</label>
                <input 
                    type="text"  
                    id="email"
                    ref={emailRef}
                    autoComplete="off"
                    onChange={(e) => updateEmail(e.target.value)}
                    value={email}
                    required
                />
        </>
    )
}

export default Email;