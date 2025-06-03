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

		// this.speed = initialSpeed;
		// this.movement = new Vector3( 0, 0, 0 );
		// this.smashCd = 0;
		// this.lastDir = 1;
		// this.dashCount = 3;

		// this.ray = new Raycaster();
		// this.ray.layers.set( Layers.Solid );

		// this.collider = new Collider( this );
		// this.updatable = new Updatable( this );

		this.boostButtonPressedEvent = (e) => {
			if ( this.speed == initialSpeed && this.dashCount >= 1 ) {
				this.speed = initialBoostSpeed;
				this.dashCount -= 1;
			}
		};
		this.boostButtonReleasedEvent = (e) => {
			// this.speed = initialSpeed;
		};
		this.reflectButtonPressedEvent = (e) => {
			this.smash();
		};
		if ( World._instance.currentGameMode == "Upgraded" ) {
			console.log("boostButtonPressed" + this.playerId);
			
			document.addEventListener( "boostButtonPressed" + this.playerId, this.boostButtonPressedEvent );
			document.addEventListener( "boostButtonReleased" + this.playerId, this.boostButtonReleasedEvent );
			document.addEventListener( "reflectButtonPressed" + this.playerId, this.reflectButtonPressedEvent );
		}
	}

	// fixedUpdate ( dt ) {
	// 	this.smashCd -= dt;

	// 	if ( World._instance.currentGameMode == "Upgraded" ) {
	// 		if ( this.dashCount < 3 )
	// 			this.dashCount += dt / initialDashCd;
	// 		else
	// 			this.dashCount = 3;
	// 		this.dashSpheresAnimation( this.dashCount );
	// 	}
	// }

	// update( dt ) {
	// 	if (this.playerId == 1 )
	// 		this.movement = new Vector3( 0, InputMap.movementAxis1.value, 0 );
	// 	else if ( this.playerId == 2 )
	// 		this.movement = new Vector3( 0, InputMap.movementAxis2.value, 0 );

	// 	if ( this.speed > initialSpeed ) {
	// 		this.speed -= initialBoostSpeed * dt * 8;
	// 		if ( this.speed < initialSpeed )
	// 			this.speed = initialSpeed;
	// 	}
	// 	if ( this.movement.y !== 0 )
	// 		this.lastDir = this.movement.y;

	// 	if ( this.speed > initialSpeed ) {
	// 		this.movement = new Vector3( 0, this.lastDir, 0 );
	// 	}
		
	// 	this.ray.set( this.position, this.movement );
	// 	this.ray.far = this.length / 2 + this.speed * dt;
	// 	const hits = this.ray.intersectObjects( Collider.getSolids() );
	// 	if ( hits.length > 0 && hits[0].distance > 0 ) {
	// 		this.position.add( this.movement.clone().multiplyScalar( hits[0].distance - this.length / 2 ) );
	// 	} else {
	// 		this.position.add( this.movement.clone().multiplyScalar( this.speed * dt ) );
	// 	}		
	// }

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
