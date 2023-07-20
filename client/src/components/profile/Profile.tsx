import React from "react";
import "../../styles/Profile.css";
import PageWrapper from "../navbar/pageWrapper";

function Profile() {
	// Sample game history data
	const gameHistory = [
		{ name: "User 1", score: 100, date: "2023-07-19", result: "Win" },
		{ name: "User 2", score: 150, date: "2023-07-20", result: "Loss" },
		{ name: "User 3", score: 120, date: "2023-07-21", result: "Win" },
	  ];
  return (
    <PageWrapper>
		<div className="cont">
    	<div className="profile-container_1">
        	<div className="profile-picture-container">
            <img
              src="https://anniversaire-celebrite.com/upload/250x333/alf-250.jpg"
              alt="Profile"
              className="profile-picture"
            />
			</div>
			<div className="profile-info">
				<h2>Profile</h2>
				<br />
				<h3>Alf</h3>
				<h5 className="blue-underline">modifier</h5>
				<br />
				<h4>Rank 1 | Lvl 800</h4>
				<br />
				<h4>Email</h4>
				<h5 className="blue-underline">modifier</h5>
				<br />
				<h4>Password</h4>
				<h5 className="blue-underline">modifier</h5>
				<br />
				<h4>Double factors</h4>
          </div>
    	</div>
		<div className="profile-container_2">
          <h2>Game History</h2>
          <table className="game-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Score</th>
                <th>Date</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {gameHistory.map((game, index) => (
                <tr key={index}>
                  <td>{game.name}</td>
                  <td>{game.score}</td>
                  <td>{game.date}</td>
                  <td>{game.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
		</div>
		</div>
    </PageWrapper>
  );
}

export default Profile;
