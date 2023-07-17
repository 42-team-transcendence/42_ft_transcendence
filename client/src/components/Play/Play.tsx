import React from "react";
import PageWrapper from "../navbar/pageWrapper";

const Play: React.FC = () => {
  return (
	<PageWrapper>
	<div
	style={{
	  display: "flex",
	  justifyContent: "center",
	  alignItems: "center",
	  height: "100vh",
	}}
  >
	<div
	  style={{
		width: "400px",
		height: "600px",
		backgroundColor: "white",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	  }}
	>
	  <div style={{ maxWidth: "100%", padding: "20px" }}>
	  <div
		style={{
		maxWidth: "100%",
		padding: "20px",
		textAlign: "justify",
		}}
	>
        <h2> Game </h2>
			<h3>	About Pong</h3>
			<p> Pong is one of the first computer games that were ever created. This simple "tennis-like" game features two paddles and a ball. The goal is to defeat your opponent by being the first one to gain 10 points. A player gets a point once the opponent misses a ball.
			The game can be played with two human players or one player against a computer-controlled paddle. The game was originally developed by Allan Alcorn and released in 1972 by Atari corporations.
			Soon, Pong became a huge success and became the first commercially successful game. In 1975, Atari released a home edition of Pong (the first version was played on Arcade machines), which sold 150,000 units.
			Today, the Pong Game is considered to be the game that started the video games industry, as it proved that the video games market can produce significant revenues.
			</p>
		</div>
      </div>
    </div>
	</div>
	</PageWrapper>
  );
};

export default Play;
