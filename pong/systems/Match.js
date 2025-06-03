import { Vector3 } from 'three';
import { World } from '../World.js';
import { Player } from '../components/Player.js';
import { Opponent } from '../components/Opponent.js';
import { GameState } from './GameStates.js';
import { Updatable } from '../modules/Updatable.js';

let world;
const maxScore = 3;

const divNicknames = [ 'left-player-name', 'right-player-name' ];

class Match {
	constructor( myId, myNickname, opponentNickname ) {
		world = World._instance;

		world.currentGameState = GameState.Connecting;
		this.waitingForGoal = false;
		
		this.participants = [];

		for (let i = 0; i < 2; i++) {
			if ( i == myId ) {
				this.participants.push( new Player( new Vector3( -7.2 + 14.4 * i, 0, 0 ), i ) );
				this.participants[i].nickname = myNickname;
				this.self = this.participants[i];
			} else {
				this.participants.push( new Player( new Vector3( -7.2 + 14.4 * i, 0, 0 ), i ) );
				this.participants[i].nickname = opponentNickname;
				this.opponent = this.participants[i];
			}
			this.participants[i].sideId = i;
			this.participants[i].position.setZ( -1 );
			// document.getElementById(divNicknames[i]).classList.remove("d-none");
			document.getElementById(divNicknames[i]).style.display = 'block';
			document.getElementById(divNicknames[i]).innerHTML = this.participants[i].nickname;
		}
		world.terrain.leftGoalZone.paddle = this.participants[0];
		world.terrain.rightGoalZone.paddle = this.participants[1];
		
		this.initMatch();

		this.updatable = new Updatable( this );
		this.loading = false;
	}

	update() {}

	fixedUpdate() {}

	initMatch() {
		// console.log("-- Starting Match --");
		world.currentGameState = GameState.InMatch;
		document.getElementById("coin").play();
		document.querySelector('#start-button').style.display = 'none';

		world.balls.hide();
		world.score.reset();
		this.participants.forEach(element => {
			element.position.setZ(0);
		});
		world.balls.renderer.setEnabled(true);
		world.balls.updatable.setEnabled(true);
		world.camera.viewTable( 1, function() {
			if ( world.currentGameState === GameState.InMatch ) {
				world.balls.init();
			}
		});
	}

	endMatch() {
		world.currentGameState = GameState.MatchEnding;

		// this.showResultMatchUI();

		this.participants.forEach(element => {
			element.dashSpheresAnimation( 0 );
			element.delete();
		});
		this.participants = [];
		divNicknames.forEach(element => {
			if (document.getElementById(element))
				// document.getElementById(element).classList.add("d-none");
				document.getElementById(element).style.display = 'none';
		});
		document.querySelector('#backToMenu-button').style.display = 'block';
		document.querySelector('#backToMenu-button').addEventListener('click', this.backToMenu)

		world.balls.hide();
		world.balls.updatable.setEnabled(false);
		world.balls.renderer.setEnabled(false);
	
		// if ( this.socket != undefined)
		// 	this.socket.close();
		// this.socket.removeEventListener( "message", this.onWebsocketReceivedEvent );

		this.updatable.delete();
	}

	showResultMatchUI() {
		document.getElementById('result').classList.remove('d-none')
		document.getElementById('resultMatch').classList.remove('d-none')
		document.getElementById('bracket').classList.toggle('d-none', true)
		
		document.getElementById('leaveTournament').classList.toggle('d-none', true)
		document.getElementById('resultButton').classList.toggle('d-none', false);
		document.getElementById('resultButton').addEventListener('click', this.backToMenu)
		this.toggleLeaveBtn(false)
		this.setResultMatch();
	}

	increment( sideId ) {
		this.participants[sideId - 1].score += 1;

		world.score.setText(
			( this.participants[0].score < 10 ? "0" : "" ) + this.participants[0].score, 
			( this.participants[1].score < 10 ? "0" : "" ) + this.participants[1].score
		);

		if ( this.participants[0].score >= maxScore || this.participants[1].score >= maxScore ) {
			this.endMatch();
		}
	}

	setResultMatch() {
		document.getElementById('leftName').innerHTML = this.participants[0].nickname;
		document.getElementById('leftScore').innerHTML = this.participants[0].score;
		document.getElementById('rightScore').innerHTML = this.participants[1].score;
		document.getElementById('rightName').innerHTML = this.participants[1].nickname;

		if ( this.self.score < maxScore && this.opponent.score < maxScore )
			document.getElementById("resultTitle").innerHTML = "Disconnected";
		if ( this.self.score >= maxScore ) {
			document.getElementById("fanfare").play();
			document.getElementById("resultTitle").innerHTML = "YOU WIN!";
		}
		if ( this.opponent.score >= maxScore )
			document.getElementById("resultTitle").innerHTML = "YOU LOST!";
		}

	backToMenu(event) {
		// const bracket = document.getElementById('bracket');
		// const result = document.getElementById('result');
		// const resultMatch = document.getElementById('resultMatch');

		// if (!bracket.classList.contains('d-none'))
		// 	bracket.classList.add('d-none');
		// if (!result.classList.contains('d-none'))
		// 	result.classList.add('d-none');
		// if (!resultMatch.classList.contains('d-none'))
		// 	resultMatch.classList.add('d-none');

		// updateMatchHistory();

		document.querySelector('#backToMenu-button').style.display = 'none';
		const currentTarget = event.currentTarget;
		currentTarget.removeEventListener('click', this.backToMenu);

		world.camera.viewLarge( 1 , function() {
			// document.getElementById('ui').classList.remove("d-none");
			// document.getElementById('toastContainer').classList.remove('d-none')
			// world.changeStatus( "ONL" );
			world.currentGameState = GameState.InMenu;
			document.querySelector('#start-button').style.display = 'block';
		});

	}
}

export { Match };