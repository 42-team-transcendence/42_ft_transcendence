import PageWrapper from "../navbar/pageWrapper";
import React, { useState, useEffect, useRef } from 'react';
import io, {Socket} from "socket.io-client"
import { useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const Play: React.FC = () => {
	const gameBoardRef = useRef<HTMLCanvasElement>(null);
  	const scoreTextRef = useRef<HTMLDivElement>(null);
  	const resetBtnRef = useRef<HTMLButtonElement>(null);

	const gameWidth = 800; 
	const gameHeight = 400;
	const boardBackground = "white";
	const paddleColor = "black";
	// const paddleColor = "#FF8100";
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
	  socketId: string | undefined,
	  Id: number,
	  width: number,
	  height: number,
	  x: number,
	  y: number,
	}

	const ballColors = {
		pink: "pink",
		orange: "orange",
	  };
	
	let ballColor = ballColors.pink;
	let ballBorderColor = "black"
	
/*-------------------Get User & Create NewSocket---------------------------------------------------------------------------------*/
    
const axiosPrivate = useAxiosPrivate();

    const [socket, setSocket] = useState<Socket>();
    const [paddle, setPaddle] = useState<Paddle>({
		socketId: undefined,
		Id: 0,
		width: 0,
		height: 0,
		x: 0,
		y: 0,
	});
    const [socketIsConnected, setSocketIsConnected] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<any>();
    const [counter, setCounter] = useState<any>(0);

	useEffect(() => { //Fetch current user data
		const getCurrentUser = async () => { //definition de la fonction
			try {
                const response = await axiosPrivate.get('/users/me', {
                    headers: { 'Content-Type': 'application/json'},
                    withCredentials: true
                })
                setCurrentUser(response.data);
                console.log({currentUser : response.data});
			} catch (error:any) {
				console.log(error.response );
			}
		}
		getCurrentUser(); //appel de la fonction
    }, [])

	    //Création de la socket client
	useEffect(() => {
		if (currentUser && currentUser.sub){
		const newSocket = io(
			"http://localhost:3333", //dès que j'essaie de changer le port j'ai une erreur
			{
				path: "/game",
				withCredentials: true,
				autoConnect: true,
				auth: {token: "TODO : gérer les tokens d'authentification ici"},
				query: {"Id": currentUser.sub}
			});
		setSocket(newSocket)
		}
	}, [currentUser])

	useEffect(() => {
		function onConnect() {
			console.log("socket onConnect useEffect")
			setSocketIsConnected(true);
				
			socket?.on('counter', function(data){
				console.log("DATA === " + data)
				setCounter(data);
				let paddleInstance: Paddle;
				if (data % 2 === 0) {
					paddleInstance = {
						socketId: socket?.id,
						Id: currentUser?.sub || 0,
						width: 25,
						height: 100,
						x: 0,
						y: 0,
					};
				} else {
					paddleInstance = {
						socketId: socket?.id,
						Id: currentUser?.sub || 0,
						width: 25,
						height: 100,
						x: gameWidth - 25,
						y: gameHeight - 100,
					};
				}
				setPaddle(paddleInstance);
				socket?.emit("playerData", paddleInstance);
			});

			socket?.emit('getCounter'); // Demande le compteur au serveur
		}
			socket?.on('connect', onConnect);


			return () => {
				socket?.off('counter'); // Assurez-vous de retirer l'écoute lors du démontage du composant
			};

	}, [socket]);

/*----------------------------------------------------------------------------------------------------*/


	useEffect(() => {
		const gameBoard = gameBoardRef.current;
		const ctx = gameBoard?.getContext('2d');
		const scoreText = scoreTextRef.current;
		const resetBtn = resetBtnRef.current;
	
		if (!gameBoard || !ctx || !scoreText || !resetBtn) return;
		
		const gameStart = () => {
			console.log("COUNTER == " + counter);
				createBall();
				nextTick();
		  };
	
		  const createBall = () => {
			ballSpeed = 1;
			ballXDirection = Math.random() < 0.5 ? -1 : 1;
			ballYDirection = Math.random() < 0.5 ? -1 : 1;
			ballX = gameWidth / 2;
			ballY = gameHeight / 2;
			drawBall(ballX, ballY);
		};
		
		const nextTick = () => {
			intervalID = window.setInterval(() => {
				// cleanBoard();
				drawPaddles();
				drawBall(ballX, ballY);
				moveBall();
				checkCollision();
			}, 10);
		};

		const changeDirection = (event: KeyboardEvent) => {
			const keyPressed = event.key;
			const paddleUp = "ArrowUp";
			const paddleDown = "ArrowDown";
			
			if (paddle){
				switch (keyPressed) {
				case paddleUp:		
				if (paddle.y > 0) {
					paddle.y -= paddleSpeed;
				}
				break;
				case paddleDown:
				if (paddle.y < gameHeight - paddle.height) {
					paddle.y += paddleSpeed;
				}
				break;
				}
			}
		  };
	  
		// const cleanBoard = () => {
		// 	ctx.fillStyle = boardBackground;
		// 	ctx.fillRect(0, 0, gameWidth, gameHeight);
		// };
		
		const drawPaddles = () => {
			ctx.strokeStyle = paddleBorder;
			ctx.fillStyle = boardBackground;
			ctx.fillRect(0, 0, gameWidth, gameHeight);
			
				ctx.fillStyle = paddleColor;
				ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
				ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
				
				ctx.fillStyle = paddleColor;
				ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
				ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
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

		const moveBall = () => {
			ballX += ballSpeed * ballXDirection;
			ballY += ballSpeed * ballYDirection;
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

			if (ballX <= paddle.x + paddle.width + ballRadius) {
				if (ballY > paddle.y && ballY < paddle.y + paddle.height) {
				ballX = paddle.x + paddle.width + ballRadius; //if ball gets stuck
				ballXDirection *= -1;
				ballSpeed += 0.5;
				ballColor = ballColors.orange; // Change ball color to pink
				}
			}
			// if (ballX >= paddle.x - ballRadius) {
			// 	if (ballY > paddle.y && ballY < paddle.y + paddle.height) {
			// 	ballX = paddle.x - ballRadius; //if ball gets stuck
			// 	ballXDirection *= -1;
			// 	ballSpeed += 0.5;
			// 	ballColor = ballColors.pink; // Change ball color to orange
			// 	}
			// }
		}
	
		const updateScore = () => {
			const scoreText = scoreTextRef.current;
			if (scoreText) {
			scoreText.textContent = `${player1Score} : ${player2Score}`;
			}
		}
	
		// const resetGame = () => {
		// 	player1Score = 0;
		// 	player2Score = 0;
		// 	paddle = {
		// 		width: 25,
		// 		height: 100,
		// 		x: 0,
		// 		y: 0,
		// 	};
		// 	paddle = {
		// 		width: 25,
		// 		height: 100,
		// 		x: gameWidth - 25,
		// 		y: gameHeight - 100,
		// 	};
		// 	ballSpeed = 1;
		// 	ballX = 0;
		// 	ballY = 0;
		// 	ballXDirection = 0;
		// 	ballYDirection = 0;
		// 	updateScore();
		// 	clearInterval(intervalID);
		// 	gameStart();
		// }
	window.addEventListener("keydown", changeDirection);
	// resetBtn.addEventListener("click", resetGame);

    gameStart();

    return () => {
      // Clean up your timers or other resources if needed when the component unmounts
      clearInterval(intervalID);
      window.removeEventListener("keydown", changeDirection);
    //   resetBtn.removeEventListener("click", resetGame);
    };
  }, [paddle]);
	
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