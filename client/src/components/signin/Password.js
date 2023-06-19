
function Password ({ statePwd, fonctionUpdatePwd }) {

    const {pwd} = statePwd;
    const {updatePwd} = fonctionUpdatePwd;

    return (
        <>
             <label htmlFor="password">Password:</label>
                <input 
                    type="password"  
                    id="password"
                    onChange={(e) => updatePwd(e.target.value)}
                    value={pwd}
                    required
                />
        </>
    )
}

export default Password;