import { useNavigate } from "react-router-dom";
import useAuth from '../../hooks/useAuth';

const Callback42 = () => {

    
    const navigate = useNavigate();
    const { setAuth } = useAuth();

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    setAuth({token});
    navigate('/', { replace: true});

    return (
        <div>
		</div>
    )
}

export default Callback42;