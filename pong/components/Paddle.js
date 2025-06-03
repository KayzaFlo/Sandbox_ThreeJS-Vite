import { Collider } from '../modules/Collider.js';
import { Updatable } from '../modules/Updatable.js';
import { Renderer } from '../modules/Renderer.js';
import { Layers } from '../systems/Layers.js';
import {
	CapsuleGeometry,
	Color,
	Mesh,
	MeshBasicMaterial,
	MeshStandardMaterial,
	Raycaster,
	Vector2,
	Vector3
} from 'three';
import { Tween } from '../systems/Tween.js';
import { World } from '../World.js';

const smashAnimDuration = 0.18;

const initialSpeed = 6;
const initialBoostSpeed = 50;
const initialSmashCd = 0.4;
const initialDashCd = 4.2;

class Paddle extends Mesh {
	constructor( position, id, nickname ) {
		super( new CapsuleGeometry( 0.2, 2.0 ), new MeshStandardMaterial() );
		this.castShadow = true;
		this.receiveShadow = true;

		this.renderer = new Renderer( this );
		this.renderer.setLayers( Layers.Default, Layers.Player, Layers.Buffer );

		this.position.copy( position );
		this.length = this.geometry.parameters.height + this.geometry.parameters.radius * 2;
		
		this.sideId = id;
		this.nickname = nickname;
		this.score = 0;
		this.dashSpheres = this.position.x < 0 ? World._instance.terrain.leftDashSpheres : World._instance.terrain.rightDashSpheres;

		const from = new Vector2( this.position.x, this.position.y );
		this.rotation.set( 0, 0, from.angle() );
		this.dir = new Vector3( 1, 0, 0 );
		this.dir.applyQuaternion( this.quaternion );


		this.speed = initialSpeed;
		this.movement = new Vector3( 0, 0, 0 );
		this.smashCd = 0;
		this.lastDir = 1;
		this.dashCount = 3;

		this.ray = new Raycaster();
		this.ray.layers.set( Layers.Solid );

		this.collider = new Collider( this );
		this.updatable = new Updatable( this );

	}

	dash() {
		if ( this.speed == initialSpeed && this.dashCount >= 1 ) {
			this.speed = initialBoostSpeed;
			this.dashCount -= 1;
		}
	}

	smash() {
		if ( this.smashCd > 0 )
			return;

		const ball = World._instance.balls.ballInst[0];
		this.smashAnimation( this.lastDir );
		this.smashCd = initialSmashCd;

		if ( this.position.distanceTo( ball.pos ) > this.length * 0.7 )
			return;

		if ( Math.sign( ball.dir.x ) != Math.sign( this.position.x ) )
			return;

		const pos = new Vector3(
			this.position.x,
			World._instance.balls.ballInst[0].pos.y,
			this.position.z
		);
		document.getElementById("crash").play();
		World._instance.balls.ballInst[0].dir.y += this.lastDir;
		World._instance.balls.playerCollision( World._instance.balls.ballInst[0], pos, this, true );
		// World._instance.balls.ballInst[0].smashed = true;
		// World._instance.balls.ballInst[0].dir.normalize();
		// if (this.playerId == 1)
		// 	World._instance.balls.ballInst[0].spin = InputMap.movementAxis1.value * Math.PI / 2;
		// else if (this.playerId == 2)
		// 	World._instance.balls.ballInst[0].spin = InputMap.movementAxis2.value * Math.PI / 2;
		World._instance.balls.ballInst[0].spin = this.movement.y * Math.PI / 2;
		this.onCollision( World._instance.balls.ballInst[0] );
	}

	smashAnimation( dir ) {
		const oldRotation = this.rotation.clone();
		const rot = Math.PI * -dir * Math.sign( this.position.x );
		new Tween( this.rotation, new Vector3( this.rotation.x, this.rotation.y, this.rotation.z + rot ), smashAnimDuration ).then(
			() => { this.rotation.copy( oldRotation ); }
		);
	}

	dashSpheresAnimation( count ) {
		for (let i = 0; i < 3; i++) {
			if ( count >= i + 1 ) {
				this.dashSpheres[i].material.emissive = new Color( 0xffffff );
				this.dashSpheres[i].material.emissiveIntensity = 10;
			}
			else {
				this.dashSpheres[i].material.emissive = new Color( 0xff00ff + ( 0x00ff00 * ( count - i ) ) - (( 0x00ff00 * ( count - i ) ) % 0x000100) );
				this.dashSpheres[i].material.emissiveIntensity = ( count - i );
			}
		}		
	}

	
	fixedUpdate ( dt ) {
		this.smashCd -= dt;

		if ( World._instance.currentGameMode == "Upgraded" ) {
			if ( this.dashCount < 3 )
				this.dashCount += dt / initialDashCd;
			else
				this.dashCount = 3;
			this.dashSpheresAnimation( this.dashCount );
		}
	}

	update( dt ) {
		if ( this.speed > initialSpeed ) {
			this.speed -= initialBoostSpeed * dt * 8;
			if ( this.speed < initialSpeed )
				this.speed = initialSpeed;
		}
		if ( this.movement.y !== 0 )
			this.lastDir = this.movement.y;

		if ( this.speed > initialSpeed ) {
			this.movement = new Vector3( 0, this.lastDir, 0 );
		}
		
		this.ray.set( this.position, this.movement );
		this.ray.far = this.length / 2 + this.speed * dt;
		const hits = this.ray.intersectObjects( Collider.getSolids() );
		if ( hits.length > 0 && hits[0].distance > 0 ) {
			this.position.add( this.movement.clone().multiplyScalar( hits[0].distance - this.length / 2 ) );
		} else {
			this.position.add( this.movement.clone().multiplyScalar( this.speed * dt ) );
		}		
	}

	onCollision( hit ) {
	}

	delete() {
		this.renderer.delete();
		this.updatable.delete();
		this.collider.delete();
	}
}

export { Paddle };
