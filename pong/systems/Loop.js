import { Clock } from 'three';

import workerlink from '/pong/worker.js?url';

const clock = new Clock();
const updatables = [];

let t1 = 0;
let timeFreezed = 0;

class Loop {
	constructor( camera, scene, renderer, composer ) {
		this.start = function() {
			clock.start();
			renderer.setAnimationLoop(() => {
				this.tick();
				// renderer.render(scene, camera);
				composer.render(1);
			});
		}
		this.stop = function() {
			clock.stop();
			renderer.setAnimationLoop(null);
		}

		let worker = new Worker(workerlink);
		worker.onmessage = (e) => {
			this.fixedTick(e);
		}

		timeFreezed = 0;
	}

	fixedTick() {
		const delta = (new Date().getTime() - t1) / 1000;
		t1 = new Date().getTime();
		
		if ( timeFreezed > 0 ) {
			timeFreezed -= delta;
			return;
		}
		
		for( const object of updatables ) {
			if ( typeof object.fixedUpdate === "function" )
				object.fixedUpdate( delta );
		// else
		// 	console.warn("fixedUpdate() called but undefined!");
		}
	}
	
	tick () {
		if ( timeFreezed > 0 )
			return;

		const delta = clock.getDelta();
		for( const object of updatables ) {
			if ( typeof object.update === "function" )
				object.update( delta );
			else
				console.warn("update() called but undefined!");
		}
	}

	timeFreeze( duration ) {
		timeFreezed = duration;
	}

	static addUpdatable( object ) { updatables.push(object); }
	static removeUpdatable( object ) { updatables.splice( updatables.indexOf(object), 1 ); }
	static getUpdatable() { return updatables; }
}

export { Loop };
