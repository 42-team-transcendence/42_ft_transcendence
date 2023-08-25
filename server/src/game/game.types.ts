import { Server, Socket, ServerOptions} from 'socket.io';

export interface Paddle {
	socketId: string,
	Id: number,
	width: number,
	height: number,
	x: number,
	y: number,
	score: number,
	color: string,
  }

export interface Ball {
	X: number;
	Y: number;
	color: string;
}

export interface GameInfo{
	players: Paddle[];
	gameWidth: number; 
	gameHeight: number;
	ballRadius: number;
	paddleSpeed: number;
	ballSpeed: number;
	ball: Ball;
	ballXDirection: number;
	ballYDirection: number;
	intervalID: NodeJS.Timeout | undefined;
	ifDBsaved: boolean;
};