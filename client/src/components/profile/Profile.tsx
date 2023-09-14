import { useState, useContext, useEffect, ChangeEvent } from "react";

// =============================================================================
// IMPORT COMPONENTS ===========================================================
import PageWrapper from "../navbar/pageWrapper";
import GameHistory from "./GameHistory";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import EmailModal from "./EmailModal";
import PwdModal from "./PasswordModal";
import AuthContext, { AuthProvider } from '../../context/AuthProvider';
import NickModal from "./NicknameModal";
import DoubleAuth from "../auth2fa/Doubleauth";
import { useOnlineStatus } from "../../context/OnlineStatus";

// =============================================================================
// IMPORT STYLES ===============================================================
import '../../styles/profile/Profile.css';
import Checkbox from '@mui/material/Checkbox';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';

// =============================================================================
// INTERFACES ==================================================================
interface User {
	id:number;
	email: string;
	nickname: string;
	auth2fa: boolean;
	avatar: string;
	score: number;
	rank: number;
}

// =============================================================================
// FUNCTION ====================================================================

function Profile() {

	const axiosPrivate = useAxiosPrivate();
	const { auth, setAuth } = useContext(AuthContext);
	const onlineUsers = useOnlineStatus();

	// =============================================================================
	// USE EFFECT ==================================================================
	const [user, setUser] = useState<User>({id:0, email: '', nickname: '', auth2fa: false, avatar: '', score: 0, rank: 0, });
	const [isDoubleAuthEnabled, setIsDoubleAuthEnabled] = useState(user?.auth2fa || false);
	const [isUserOnline, setIsUserOnline] = useState<boolean>(false)
	const [display, setDisplay] = useState<boolean | undefined>(undefined);

	useEffect(()=>{
		for (const client of onlineUsers.values()) {
			if (client.userId && parseInt(client.userId) === user?.id) {
				if(client.isOnline) {
					setIsUserOnline(true);
				}
				break;
			}
		}
	}, [user])

    useEffect(() => {
        // Make an API request to fetch user details
        axiosPrivate.get('/users/me')
            .then(response => {
				setDisplay(response.data.auth2fa);
                setUser(response.data);
            })
            .catch(error => {
                console.error('Error fetching user details:', error);
            });

    }, []);

	const disabled2fa = async () => {
        const response = await axiosPrivate.post(
			'/users/update2fa',
			JSON.stringify({ auth2fa: false }),
			{
			  headers: { "Content-Type": "application/json" },
			  withCredentials: true,
			}
		)
	  };

	// =============================================================================
	// EMAIL MODAL =================================================================

	// State for controlling the email modal
	const [isEmailModalOpen, setEmailModalOpen] = useState(false);

	// Handler for opening the email modal
	const handleOpenEmailModal = () => {
		setEmailModalOpen(true);
	};

	// Handler for closing the email modal
	const handleCloseEmailModal = () => {
		setEmailModalOpen(false);
	};

	const handleSaveEmail = async (newEmail: string) => {
		try {
			const response = await axiosPrivate.post(
				'/users/email',
				JSON.stringify({ 'email': newEmail}),
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
					validateStatus: status => status >= 200 && status < 300,
				}
			);
			if (response.status === 200) {
				// Update the user's email in the user state
				setUser((prevUser) => ({ ...prevUser, email: newEmail }));
				setAuth((prevAuth) => ({ ...prevAuth, email: newEmail }))
			}
			else {
				console.error("Email update failed");
			}
		} catch (error) {
			console.error("Error updating email:", error);
		}

		handleCloseEmailModal();
	};


	// =============================================================================
	// NICKNAME MODAL ==============================================================

	// State for controlling the email modal
	const [isNickModalOpen, setNickModalOpen] = useState(false);

	// Handler for opening the email modal
	const handleOpenNickModal = () => {
		setNickModalOpen(true);
	};

	// Handler for closing the email modal
	const handleCloseNickModal = () => {
		setNickModalOpen(false);
	};

	const handleSaveNick = async (newNickname: string) => {
		try {
		  // Call your backend API to update the nickname
			const response = await axiosPrivate.post('/users/updateNick', JSON.stringify({ nickname: newNickname }), {
				headers: { "Content-Type": "application/json" },
				withCredentials: true,
			});
			if (response.status === 200) {
				setUser((prevUser) => ({ ...prevUser, nickname: newNickname }));
			} else {
				console.error('Nickname update failed');
			}
		} catch (error) {
		  	console.error('Error updating Nickname:', error);
		}

		handleCloseNickModal();
	};

	// =============================================================================
	// PWD MODAL ===================================================================

	// State for controlling the email modal
	const [isPwdModalOpen, setPwdModalOpen] = useState(false);

	// Handler for opening the email modal
	const handleOpenPwdModal = () => {
		setPwdModalOpen(true);
	};

	// Handler for closing the email modal
	const handleClosePwdModal = () => {
		setPwdModalOpen(false);
	};

	const handleSavePwd = async (newPwd: string) => {
		try {
			const response = await axiosPrivate.post('/users/pwd',  JSON.stringify({ pwd: newPwd }),
			{
				headers: { "Content-Type": "application/json" },
				withCredentials: true,
			});
			if (response.status === 200) {
				setAuth((prevAuth) => ({ ...prevAuth, pwd: newPwd }));
			} else {
				console.error('Pwd update failed');
			}
		} catch (error) {
			console.error('Error updating Pwd:', error);
		}

		handleClosePwdModal();
	};

	// =============================================================================
	// AVATAR ======================================================================
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];

		if (file) {
		  	setSelectedFile(file);
			const formData = new FormData();
			formData.append('avatar', file);
			try {
				const response = await axiosPrivate.post('/users/uploadAvatar', formData, {
					headers: {'Content-Type': 'multipart/form-data'},
					withCredentials: true,
				});
				if (response.status === 200) {
					window.location.reload();
					setUser((prevUser) => ({ ...prevUser, avatar: response.data.avatarUrl }));
			  	} else {
					console.error('Avatar update failed');
			  	}
			} catch (error) {
				console.error('Error updating avatar:', error);
			}

		};
	}
	const StyledBadge = styled(Badge)(() => ({
		'& .MuiBadge-badge': {
		  backgroundColor: isUserOnline ? 'green' : 'grey',
		  color: isUserOnline ? 'green' : 'grey',
		  boxShadow: "0 0 0 2px white",
		  width: "20px",
		  height: "20px",
		  borderRadius: 10
		},
	}));


	// =============================================================================
	// RETURN ======================================================================

	const handleSetIsDoubleAuthEnabled = (bool: boolean) => {
		setIsDoubleAuthEnabled(bool);
	}
	const handleSetDisplay = (bool: boolean) => {
		setDisplay(bool);
	}

  	return (
		<PageWrapper>
			<div className="main-container">
				<div className="container-wrap">
					{/* Render AVATAR */}
					<div className="avatar">
						<StyledBadge
							overlap="circular"
							anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
							variant="dot"
							invisible={!isUserOnline}>
							<label htmlFor="avatarInput">
								{user.nickname && <Avatar sx={{ width: 180, height: 180, border: "2px solid black"  }}  variant="square" alt={user.nickname} src={`http://localhost:3333/public/picture/${user.nickname}`} />}
							</label>
							<input
								type="file"
								id="avatarInput"
								style={{ display: 'none' }}
								accept="image/*"
								onChange={handleFileChange}
							/>
						</StyledBadge>
							<div className="avater-info">
								{user.nickname ? (
									<>
										<h1 className="name">{user.nickname}</h1>
										<span className="modifier" onClick={handleOpenNickModal}>modifier</span>
									</>
								) : (
									<p>Loading user data...</p>
								)}
							<p className="rank">Rank {user.rank} | Lvl {user.score}</p>
							</div>
					</div>
					{/* Render EMAIL */}
					<div className="element-profile">
						<h2>Email</h2>
						<div className="a-modifier">
							{user.email ? (
							<>
								<p>{user.email}</p>
								<span className="modifier" onClick={handleOpenEmailModal}>modifier</span>
							</>
							) : (
								<p>Loading user data...</p>
							)}
						</div>
					</div>
					{/* Render PASSWORD */}
					{auth.pwd && auth.pwd !== '' ? (
						<div className="element-profile">
							<h2>Password</h2>
							<div className="a-modifier">
							<p>{'*'.repeat(auth.pwd.length)}</p>
							<span className="modifier" onClick={handleOpenPwdModal}>modifier</span>
							</div>
						</div>
					) : <div/>}
					{/* Render 2FA */}
					<div className="element-profile">
						<div className="a-modifier">
							<h2> Double factors </h2>
							{!display ? (
								<Checkbox checked={false} onChange={() =>
									handleSetIsDoubleAuthEnabled(true)
								}
								/>
							) : (
									<button  onClick={() => {disabled2fa()
													handleSetIsDoubleAuthEnabled(false)
													handleSetDisplay(false)}}
													>Disable 2FA</button>
							)}
							{isDoubleAuthEnabled && <DoubleAuth handleSetIsDoubleAuthEnabled={handleSetIsDoubleAuthEnabled} handleSetDisplay={handleSetDisplay} /> }
						</div>
					</div>
				</div>
				<GameHistory/>
			</div>
			{/* Render the EmailModal component */}
			<EmailModal
				open={isEmailModalOpen}
				onClose={handleCloseEmailModal}
				onSave={handleSaveEmail}
			/>
			{/* Render the PwdModal component */}
			<PwdModal
				open={isPwdModalOpen}
				onClose={handleClosePwdModal}
				onSave={handleSavePwd}
			/>
			{/* Render the PwdModal component */}
				<NickModal
				open={isNickModalOpen}
				onClose={handleCloseNickModal}
				onSave={handleSaveNick}
			/>
		</PageWrapper>
 	);
}

export default Profile;

