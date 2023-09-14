import axios from "../../api/axios"
import CustomButton from "../../styles/buttons/CustomButton";

const AuthPage:React.FC = () => {

    const handleClick = async() => {
        try {
            axios.get('/auth/login/42').then((res) => {
                window.location.href = res.data.url;
            })
        } catch (error) {
			window.alert("can't login with 42");
            console.log(error);
        }
    }

    return (
        <CustomButton onClick={handleClick}>
            Log In with 42
        </CustomButton>
    )
}

export default AuthPage;
