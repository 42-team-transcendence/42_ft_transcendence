import { useState, useEffect } from "react"
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import '../../styles/Profile.css';

function OtherUserProfile() {
	const [user, setUser] = useState();
	const axiosPrivate = useAxiosPrivate();
	const navigate = useNavigate();
	const location = useLocation();

  let { userId } = useParams();
  console.log(useParams());
  console.log(userId);

  // useEffect(() => {
	// 	const getUser = async () => { //definition de la fonction
	// 		try {
	// 			const response = await axiosPrivate.get('/user');
	// 			console.log(response.data);
	// 			setUser(response.data);
	// 		} catch (error) {
	// 			console.log(error);
	// 		}
	// 	}
	// 	getUser(); //appel de la fonction
	// }, [])

  return (
    <div className="profile-container">
      <div className="profile-picture-container">
        <img
          src="https://anniversaire-celebrite.com/upload/250x333/alf-250.jpg"
          alt="Profile"
          className="profile-picture"
        />
      </div>
      <div className="profile-info">
		<h2>Profile</h2>
		<h3>Alf</h3>
		<p>Rank 1 | Lvl 800</p>
		<h4>Email</h4>
		<h4>Password</h4>
		<h4>Double factors</h4>
        {/* Add other profile information here */}
      </div>
    </div>
  );
}

export default OtherUserProfile;