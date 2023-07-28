import PageWrapper from "../navbar/pageWrapper";
import React, { useEffect, useRef } from 'react';


const Play: React.FC = () => {
	const gameBoardRef = useRef<HTMLCanvasElement>(null);
  	const scoreTextRef = useRef<HTMLDivElement>(null);
  	const resetBtnRef = useRef<HTMLButtonElement>(null);

	const gameWidth = 600; 
	const gameHeight = 400;
	const boardBackground = "white";
	const paddle2Color = "#FF79AF";
	const paddle1Color = "#FF8100";
	const paddleBorder = "black";
	// const ballColor = "#FF79AF";
	const ballBordercolor = "black";
	const ballRadius = 12.5;
	const paddleSpeed = 50;
	let intervalID: number | undefined;
	let ballSpeed = 1;
	let ballX = gameWidth / 2;
	let ballY = gameHeight / 2;
	let ballXDirection = 0;
	let ballYDirection = 0;
	let player1Score = 0;
	let player2Score = 0;
	
	interface Paddle {
	  width: number;
	  height: number;
	  x: number;
	  y: number;
	}
	
	let paddle1: Paddle = {
	  width: 25,
	  height: 100,
	  x: 0,
	  y: 0,
	};
	
	let paddle2: Paddle = {
	  width: 25,
	  height: 100,
	  x: gameWidth - 25,
	  y: gameHeight - 100,
	};

	const ballColors = {
		pink: "pink",
		orange: "orange",
	  };
	
	let ballColor = ballColors.pink;
	let ballBorderColor = "black"
	
	useEffect(() => {
		const gameBoard = gameBoardRef.current;
		const ctx = gameBoard?.getContext('2d');
		const scoreText = scoreTextRef.current;
		const resetBtn = resetBtnRef.current;
	
		if (!gameBoard || !ctx || !scoreText || !resetBtn) return;
	
		const changeDirection = (event: KeyboardEvent) => {
			const keyPressed = event.key;
			const paddle1Up = "w";
			const paddle1Down = "s";
			const paddle2Up = "ArrowUp";
			const paddle2Down = "ArrowDown";
	  
			switch (keyPressed) {
			  case paddle1Up:
				if (paddle1.y > 0) {
				  paddle1.y -= paddleSpeed;
				}
				break;
			  case paddle1Down:
				if (paddle1.y < gameHeight - paddle1.height) {
				  paddle1.y += paddleSpeed;
				}
				break;
			  case paddle2Up:
				if (paddle2.y > 0) {
				  paddle2.y -= paddleSpeed;
				}
				break;
			  case paddle2Down:
				if (paddle2.y < gameHeight - paddle2.height) {
				  paddle2.y += paddleSpeed;
				}
				break;
			}
		  };
	  
		const gameStart = () => {
			createBall();
			nextTick();
		  };
	
	
		const nextTick = () => {
			intervalID = window.setInterval(() => {
				cleanBoard();
				drawPaddles();
				moveBall();
				drawBall(ballX, ballY);
				checkCollision();
			}, 10);
		};
	  
		const cleanBoard = () => {
			ctx.fillStyle = boardBackground;
			ctx.fillRect(0, 0, gameWidth, gameHeight);
			};
		
			const drawPaddles = () => {
			ctx.strokeStyle = paddleBorder;
			ctx.fillStyle = boardBackground;
			ctx.fillRect(0, 0, gameWidth, gameHeight);
		
			ctx.fillStyle = paddle1Color;
			ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
			ctx.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
		
			ctx.fillStyle = paddle2Color;
			ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
			ctx.strokeRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
		};
	
		const createBall = () => {
			ballSpeed = 1;
			ballXDirection = Math.random() < 0.5 ? -1 : 1;
			ballYDirection = Math.random() < 0.5 ? -1 : 1;
			ballX = gameWidth / 2;
			ballY = gameHeight / 2;
			drawBall(ballX, ballY);
		};
	
		const moveBall = () => {
			ballX += ballSpeed * ballXDirection;
			ballY += ballSpeed * ballYDirection;
		};
	
		const drawBall = (ballX: number, ballY: number) => {
			ctx.fillStyle = ballColor;
			ctx.strokeStyle = ballBordercolor;
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
			ctx.stroke();
			ctx.fill();
		};
	
		const checkCollision = () => {
			if (ballY <= 0 + ballRadius) {
				ballYDirection *= -1;
			}
			if (ballY >= gameHeight - ballRadius) {
				ballYDirection *= -1;
			}
			if (ballX <= 0) {
				player2Score += 1;
				updateScore();
				createBall();
				return;
			}
			if (ballX >= gameWidth) {
				player1Score += 1;
				updateScore();
				createBall();
				return;
			}
			if (ballX <= paddle1.x + paddle1.width + ballRadius) {
				if (ballY > paddle1.y && ballY < paddle1.y + paddle1.height) {
				ballX = paddle1.x + paddle1.width + ballRadius; //if ball gets stuck
				ballXDirection *= -1;
				ballSpeed += 0.5;
				ballColor = ballColors.orange; // Change ball color to pink
				}
			}
			if (ballX >= paddle2.x - ballRadius) {
				if (ballY > paddle2.y && ballY < paddle2.y + paddle2.height) {
				ballX = paddle2.x - ballRadius; //if ball gets stuck
				ballXDirection *= -1;
				ballSpeed += 0.5;
				ballColor = ballColors.pink; // Change ball color to orange
				}
			}
		}
	
		const updateScore = () => {
			const scoreText = scoreTextRef.current;
			if (scoreText) {
			scoreText.textContent = `${player1Score} : ${player2Score}`;
			}
		}
	
		const resetGame = () => {
			player1Score = 0;
			player2Score = 0;
			paddle1 = {
				width: 25,
				height: 100,
				x: 0,
				y: 0,
			};
			paddle2 = {
				width: 25,
				height: 100,
				x: gameWidth - 25,
				y: gameHeight - 100,
			};
			ballSpeed = 1;
			ballX = 0;
			ballY = 0;
			ballXDirection = 0;
			ballYDirection = 0;
			updateScore();
			clearInterval(intervalID);
			gameStart();
		}
		window.addEventListener("keydown", changeDirection);
    resetBtn.addEventListener("click", resetGame);

    gameStart();

    return () => {
      // Clean up your timers or other resources if needed when the component unmounts
      clearInterval(intervalID);
      window.removeEventListener("keydown", changeDirection);
      resetBtn.removeEventListener("click", resetGame);
    };
  }, []);
	
	return (
		<PageWrapper>
			<div id="gameContainer">
				<canvas ref={gameBoardRef} width={gameWidth} height={gameHeight}></canvas>
				<div ref={scoreTextRef} id="scoreText">0 : 0</div>
				<button ref={resetBtnRef} id="resetBtn">Reset</button>
			</div>
	  </PageWrapper>
	);
  };
  
  export default Play;