import { Collider } from '../modules/Collider.js';
// import { Updatable } from '../modules/Updatable.js';
// import { Layers } from '../systems/Layers.js';
import { InputMap } from '../systems/InputManager.js';
import { Paddle } from './Paddle.js';
import {
	Raycaster,
	Vector3
} from 'three';
import { World } from '../World.js';
import { Tween } from '../systems/Tween.js';

const initialSpeed = 6;
const initialBoostSpeed = 50;
const initialSmashCd = 0.4;
const initialDashCd = 4.2;

class Player extends Paddle {
	constructor( position, id, nickname ) {
		super( position, id, nickname );

		this.isPlayer = true;
		this.playerId = id+1;

		this.boostButtonPressedEvent = (e) => this.dash()
		this.boostButtonReleasedEvent = (e) => {
			// this.speed = initialSpeed;
		};
		this.reflectButtonPressedEvent = (e) => this.smash();
		if ( World._instance.currentGameMode == "Upgraded" ) {
			console.log("boostButtonPressed" + this.playerId);
			
			document.addEventListener( "boostButtonPressed" + this.playerId, this.boostButtonPressedEvent );
			document.addEventListener( "boostButtonReleased" + this.playerId, this.boostButtonReleasedEvent );
			document.addEventListener( "reflectButtonPressed" + this.playerId, this.reflectButtonPressedEvent );
		}
	}

	update( dt ) {
		if (this.playerId == 1 )
			this.movement = new Vector3( 0, InputMap.movementAxis1.value, 0 );
		else if ( this.playerId == 2 )
			this.movement = new Vector3( 0, InputMap.movementAxis2.value, 0 );
		super.update( dt );
	}

	onCollision( hit ) {
	}

	delete() {
		super.delete();
		// this.updatable.delete();
		// this.collider.delete();
		if ( World._instance.currentGameMode == "Upgraded" ) {
			document.removeEventListener( "boostButtonPressed" + this.playerId, this.boostButtonPressedEvent );
			document.removeEventListener( "boostButtonReleased" + this.playerId, this.boostButtonReleasedEvent );
			document.removeEventListener( "reflectButtonPressed" + this.playerId, this.reflectButtonPressedEvent );
		}
	}
}

export { Player };
