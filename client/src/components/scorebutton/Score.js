import React, { useState } from "react";
import axios from "../../api/axios";

const ScoreButton = () => {
  const [score, setScore] = useState(0);

  const increaseScore = async () => {
    const updatedScore = score + 1;
    setScore(updatedScore);

    try {
		const response = await axios.post("/score", 
			JSON.stringify({ score: updatedScore }),
			{
				headers: { 'Content-Type': 'application/json'},
			}
		);

		
		if (response.ok) {
			console.log("Score updated successfully.");
		} else {
			console.error("Failed to update score.");
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
