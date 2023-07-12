import React, { useState } from "react";
import axios from "../../api/axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";

const ScoreButton = () => {
  const [score, setScore] = useState(0);

  const axiosPrivate = useAxiosPrivate();

  const increaseScore = async () => {
    const updatedScore = score + 1;
    setScore(updatedScore);

    try {
		// const response = await axios.post("/score",
		const response = await axiosPrivate.post(
			"/score",
			JSON.stringify({ score: updatedScore }),
			{
				headers: { 'Content-Type': 'application/json'},
				withCredentials: true
			}
		);

		if (response.status === 200) {
			console.log("Score updated successfully.");
		} else {
			console.error("Failed to update score.");
			console.error(response);
		}
    } catch (error) {
		console.error("Error updating score:", error);
    }
};

return (
	<div>
      <p>Score: {score}</p>
      <button onClick={increaseScore}>Increase Score</button>
    </div>
  );
};

export default ScoreButton;
//   const response = await fetch("score", {
//     method: "POST",
//     body: JSON.stringify({ score: updatedScore }),
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
