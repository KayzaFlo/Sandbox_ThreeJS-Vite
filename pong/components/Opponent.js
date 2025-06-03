import { Layers } from '../systems/Layers.js';
import { Paddle } from './Paddle.js';
import { Loop } from '../systems/Loop.js';
import { World } from '../World.js';
import {
	Color,
	Vector3
} from 'three';
import { abs, distance } from 'three/src/nodes/TSL.js';

class Opponent extends Paddle {
	constructor( position ) {
		super( position );

		this.isOpponent = true;

		this.ball = World._instance.balls.ballInst[0];

		//DEBUG COLOR
		this.material.color = new Color( 0xff0000 );
		// console.log("bah");
	}

	networkUpdate( data ) {

	}

	update( dt ) {
		if ( this.ball.pos.y + 0.1 > this.position.y )
			this.movement = new Vector3( 0, 1, 0 );
		else if ( this.ball.pos.y - 0.1 < this.position.y )
			this.movement = new Vector3( 0, -1, 0 );
		super.update( dt );

		if ( Math.abs(this.ball.pos.x - this.position.x) < 1 && Math.abs(this.ball.pos.y - this.position.y) > 3) {
			this.dash()
		}
		

		if (Math.abs(this.ball.pos.y - this.position.y) < 2 && this.ball.pos.distanceTo(this.position) < 1.5) {
			this.smash();
		}
	}
}

export { Opponent };
