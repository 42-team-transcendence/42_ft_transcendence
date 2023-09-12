import React from "react";
import PageWrapper from "../navbar/pageWrapper";

// =============================================================================
// IMPORT STYLES ===============================================================
import '../../styles/Rules.css';

const Rules:React.FC = () => {
	return (
		<PageWrapper>
			<div className="rules">
				<h1 className="rules-h1">The Bouncing Beginnings</h1>
				<p>Pong, the OG of video games, was born in the wild '70s, when disco balls ruled the dance floor and sideburns were a fashion statement.
					Created by Atari wizardry, Pong was like virtual tennis but with pixelated paddles, making your grandma's ping pong look so yesterday.
				</p>

				<p className="rules-p"><span className="rules-nb">#1: </span>Two paddles, one on each side, and a bouncing pixel ball.
					Keep that ball in play, or you'll be the Pong loser of the day!
				</p>

				<p><span className="rules-nb">#2: </span>No power-ups or fancy moves here. Just slide your paddle up and down, left and right, and defend with all your might.
					Pong parties were all the rage, as friends gathered 'round the TV screen, hooting and hollering, like they'd never seen.
					Pong's legacy grew, inspiring the gaming revolution we know today, from pixel to VR, it's come a long way!
				</p>

				<p><span className="rules-nb">#3: </span>Score a point when your opponent drops the ball, but don't get too cocky, 'cause Pong can make you fall!
				</p>

				<p>History lesson: Pong paved the way, making arcades cool and controllers sway. It's where the gaming journey found its first play.
					Simplicity is key, with Pong's timeless charm, a game so easy, it'll do no harm.
					So, here's to Pong, the game that started it all. From 1972 to forevermore, it'll always be a ball!
				</p>
				
			</div>
		</PageWrapper>
	)
  }

export default Rules;