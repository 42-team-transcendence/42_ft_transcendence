import PageWrapper from "../navbar/pageWrapper";
import React, { useState, useEffect, useRef } from 'react';
import io, {Socket} from "socket.io-client"
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import '../../styles/Play.css'

const Play: React.FC = () => {

	const gameBoardRef = useRef<HTMLCanvasElement>(null);
  	const scoreTextRef = useRef<HTMLDivElement>(null);

	const gameWidth = 800; 
	const gameHeight = 400;
	const boardBackground = "white";
	const paddleBorder = "black";
	const ballBordercolor = "black";
	const ballRadius = 12.5;
	
	interface Paddle {
	  socketId: string | undefined,
	  Id: number,
	  width: number,
	  height: number,
	  x: number,
	  y: number,
	  score: number,
	  color: string,
	}

	interface Ball {
		X: number;
		Y: number;
		color: string;
	  }

/*---------------------------------------Get User & Create NewSocket-------------------------------------------------------------*/
/*-------------------------------------------------------------------------------------------------------------------------------*/
    
const axiosPrivate = useAxiosPrivate();

    const [socket, setSocket] = useState<Socket>();
    const [currentUser, setCurrentUser] = useState<any>();
	const [winner, setWinner] = useState<any>();
	const [start, setStart] = useState<boolean>(false);
	const [over, setOver] = useState<boolean>(false);
	const [disconnect, setDisconnect] = useState<boolean>(false);
	const [roomName, setRoomName] = useState<string>();
	const roomNameRef = useRef<string | undefined>(roomName);

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
    }, [axiosPrivate])

	    //Création de la socket client
	useEffect(() => {
		if (currentUser && currentUser.id){
		const newSocket = io(
			"http://localhost:3333", //dès que j'essaie de changer le port j'ai une erreur
			{
				path: "/game",
				withCredentials: true,
				autoConnect: true,
				auth: {token: "TODO : gérer les tokens d'authentification ici"},
				query: {"Id": currentUser.id}
			});
		setSocket(newSocket)
		console.log("!! current user ID !! == " + currentUser.id);
		}
	}, [currentUser])

	useEffect(() => {
		
		function onConnect() {
			
			socket?.on('roomAssigned', (room) => {
				console.log("ROOMNAME == " + room);
				setRoomName(room);
				const data = {
					currentUser: currentUser.id,
					socketId: socket?.id,
					roomName: room,
				}
				socket?.emit("playerData", data);
			});
		}

		socket?.on('connect', onConnect);
		socket?.on('playerDisconnected', () => {
			setDisconnect(true);
			setStart(false);
		});

		socket?.on('game',  (data: { ball: Ball, players: Paddle[] }) => {
			const receivedBall = data.ball;
			const receivedPlayers = data.players;
		
			// Appelle la fonction game en passant receivedBall et receivedPlayers comme arguments
			setStart(true);
			game(receivedBall, receivedPlayers);
		});

		window.addEventListener("keydown", changeDirection);

		return () => {
			socket?.disconnect(); // Assurez-vous de retirer l'écoute lors du démontage du composant
			window.removeEventListener("keydown", changeDirection);
		};

	}, [socket]);

/*-------------------------------------------------------------------------------------------------------------------------------*/
/*-------------------------------------------------------------------------------------------------------------------------------*/


// Mise à jour de la référence en utilisant l'effet
useEffect(() => {
  roomNameRef.current = roomName;
}, [roomName]);

	const changeDirection = (event: KeyboardEvent) => {

		const currentRoomName = roomNameRef.current;
		event.preventDefault();

		const data = {
			keyPressed: event.key,
			roomName: currentRoomName,
		}
		
		socket?.emit("changeDirection", data);
	};

	const game = (ball: Ball, players: Paddle[]) => {

		// console.log("start == " + start);
		const gameBoard = gameBoardRef.current;
		const ctx = gameBoard?.getContext('2d');
		const scoreText = scoreTextRef.current;
	
		if (!gameBoard || !ctx || !scoreText ) return;

		  const drawBall = () => {
			  ctx.fillStyle = ball.color;
			  ctx.strokeStyle = ballBordercolor;
			  ctx.lineWidth = 2;
			  ctx.beginPath();
			  ctx.arc(ball.X, ball.Y, ballRadius, 0, 2 * Math.PI);
			  ctx.stroke();
			  ctx.fill();
		  };

		const drawPaddles = () => {
			ctx.strokeStyle = paddleBorder;
			ctx.fillStyle = boardBackground;
			ctx.fillRect(0, 0, gameWidth, gameHeight);
			
				ctx.fillStyle = players[0].color;
				ctx.fillRect(players[0].x, players[0].y, players[0].width, players[0].height);
				ctx.strokeRect(players[0].x, players[0].y, players[0].width, players[0].height);
				
				ctx.fillStyle = players[1].color;
				ctx.fillRect(players[1].x, players[1].y, players[1].width, players[1].height);
				ctx.strokeRect(players[1].x, players[1].y, players[1].width, players[1].height);
		};
	
		const updateScore = () => {
			const scoreText = scoreTextRef.current;
			if (scoreText) {
			scoreText.textContent = `${players[0].score} : ${players[1].score}`;
			}
			if (players[0].score >= 3) {
				setOver(true);
				setWinner(players[0].Id);
			}
			if (players[1].score >= 3) {
				setOver(true);
				setWinner(players[1].Id);
			}
		}
		drawPaddles();
		drawBall();
		updateScore();
}

return (
    <PageWrapper>
        <div id="gameContainer">
            {!start && !disconnect && <div className="waitingMessage">Waiting for an opponent <span className="dot-1">.</span><span className="dot-2">.</span><span className="dot-3">.</span></div>}
            {start && !over && (
                <>
                    <canvas ref={gameBoardRef} width={gameWidth} height={gameHeight}></canvas>
                    <div ref={scoreTextRef} id="scoreText">0 : 0</div>
                </>
            )}
            {over && winner === currentUser.id && <div id="winnerMessage">You win!</div>}
            {over && winner !== currentUser.id && <div id="looserMessage">You loose...</div>}
            {disconnect && !start && <div id="disconnect">The other player has disconnected !</div>}

        </div>
    </PageWrapper>
);

};

export default Play;



















// {over && <div id="gameOverMessage">Game Over!</div>}

// return (
//     <PageWrapper>
//         <div id="gameContainer">
// 		{ !start ? (
//                 <div id="waitingMessage">Waiting for an adversaire !</div>
//             ) : start && !over ? (
//                 <>
//                     <canvas ref={gameBoardRef} width={gameWidth} height={gameHeight}></canvas>
// 					<div ref={scoreTextRef} id="scoreText">0 : 0</div>
//                     <button ref={resetBtnRef} id="resetBtn">Reset</button>
//                 </>
//             ) : (
//                 <div id="gameOverMessage">Game Over!</div>
//             )}
//         </div>
//     </PageWrapper>
// );



// return (
// 	<PageWrapper>
// 		<div id="gameContainer">
// 			<canvas ref={gameBoardRef} width={gameWidth} height={gameHeight}></canvas>
// 			<div ref={scoreTextRef} id="scoreText">0 : 0</div>
// 			<button ref={resetBtnRef} id="resetBtn">Reset</button>
// 		</div>
//   </PageWrapper>
// );












  		// const nextTick = () => {
		// 	intervalID = window.setInterval(() => {
		// 		// cleanBoard();
		// 		drawPaddles();
		// 		drawBall(ballX, ballY);
		// 		// moveBall();
		// 		// checkCollision();
		// 	}, 10);
		// };

	// const moveBall = () => {
	// 	ballX += ballSpeed * ballXDirection;
	// 	ballY += ballSpeed * ballYDirection;
	// };

	// const checkCollision = () => {
	// 	if (ballY <= 0 + ballRadius) {
	// 		ballYDirection *= -1;
	// 	}
	// 	if (ballY >= gameHeight - ballRadius) {
	// 		ballYDirection *= -1;
	// 	}
	// 	if (ballX <= 0) {
	// 		player2Score += 1;
	// 		updateScore();
	// 		createBall();
	// 		return;
	// 	}
	// 	if (ballX >= gameWidth) {
	// 		player1Score += 1;
	// 		updateScore();
	// 		createBall();
	// 		return;
	// 	}

	// 	if (ballX <= paddle.x + paddle.width + ballRadius) {
	// 		if (ballY > paddle.y && ballY < paddle.y + paddle.height) {
	// 		ballX = paddle.x + paddle.width + ballRadius; //if ball gets stuck
	// 		ballXDirection *= -1;
	// 		ballSpeed += 0.5;
	// 		ballColor = ballColors.orange; // Change ball color to pink
	// 		}
	// 	}
		// if (ballX >= paddle.x - ballRadius) {
		// 	if (ballY > paddle.y && ballY < paddle.y + paddle.height) {
		// 	ballX = paddle.x - ballRadius; //if ball gets stuck
		// 	ballXDirection *= -1;
		// 	ballSpeed += 0.5;
		// 	ballColor = ballColors.pink; // Change ball color to orange
		// 	}
		// }
	// }

	// const updateScore = () => {
	// 	const scoreText = scoreTextRef.current;
	// 	if (scoreText) {
	// 	scoreText.textContent = `${player1Score} : ${player2Score}`;
	// 	}
	// }