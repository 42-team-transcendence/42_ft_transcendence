import axios from "../../api/axios"
import CustomButton from "../../styles/buttons/CustomButton";

export default function AuthPage() {

    const handleClick = () => {
        try{
            axios.get('/auth/login/42')
                .then((res) => {
                window.location.href = res.data.url;
            });

        }
        catch{
			window.alert("can't login with 42");
        }

    }

    return (
        <CustomButton onClick={handleClick}>
            Log In with 42
        </CustomButton>
    )
}
