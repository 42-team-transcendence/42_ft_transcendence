import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

interface ScoreData {
  score: number;
}

const ScoreButton: React.FC = () => {
  const [score, setScore] = useState<number>(0);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    fetchScore();
  }, []);

  const fetchScore = async () => {
    try {
      const response = await axiosPrivate.get<ScoreData>("/users/score");
      console.log("API response:", response); // Log the entire response object 
	  if (response.status === 200) {
        console.log(response.data);
        const { score } = response.data;

        setScore(score);
        console.log("SCORE = :", score);
      }
    } catch (error) {
      console.error("Error fetching score:", error);
    }
  };

  const increaseScore = async () => {
    const updatedScore = score + 1;
    setScore(updatedScore);

    try {
      const response = await axiosPrivate.post(
        "/users/score",
        JSON.stringify({ score: updatedScore }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
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
