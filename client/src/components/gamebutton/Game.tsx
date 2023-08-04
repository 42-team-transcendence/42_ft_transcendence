import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import axios from "axios";

interface GameResult {
  winnerId: number;
  loserId: number;
}

const GameButton: React.FC = () => {
  const axiosPrivate = useAxiosPrivate();
  const [value, setValue] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  useEffect(() => {
    if (gameResult) {
      saveGameResult(gameResult);
    }
  }, [gameResult]);

  const handleValue = async () => {
    const randomNumber = Math.floor(Math.random() * 10) + 1;
    setValue(randomNumber);
    await determineWinner(randomNumber);
  };

  const determineWinner = async (randomNumber: number) => {
    const currentPlayerId = 1; // Assuming the current player is Player 1
    const otherPlayerId = 2; // Assuming the other player is Player 2

    const isEven = randomNumber % 2 === 0;
    const winnerId = isEven ? currentPlayerId : otherPlayerId;
    const loserId = isEven ? otherPlayerId : currentPlayerId;

    setGameResult({ winnerId, loserId });
  };

  const saveGameResult = async (gameResult: GameResult) => {
    try {
		console.log({ gameResult });
		const response = await axiosPrivate.post("/game", gameResult);
		console.log("Game result saved successfully:", response.data);
    } catch (error) {
      	console.error("Failed to save game result:", error);
    }
  };

  return (
    <div>
      <p>GameButton Score: {score}</p>
      <button onClick={handleValue}> Play</button>
    </div>
  );
};

export default GameButton;
