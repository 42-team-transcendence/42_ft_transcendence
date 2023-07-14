import React from "react";
import '../../styles/Profile.css';

function Profile() {
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

export default Profile;