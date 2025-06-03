import { Updatable } from '../modules/Updatable.js';
import {
	Vector2
} from 'three';

const InputMap = {
	movementAxis1 : {
		value : 0,
		inputStrength : new Vector2( 0, 0 ),
		keyPositive : ["KeyW"],
		keyNegative : ["KeyS"]
	},
	boostButton1 : {
		value : false,
		key : ["ShiftLeft"],
		eventPressed: new Event("boostButtonPressed1"),
		eventHold: new Event("boostButtonHold1"),
		eventReleased: new Event("boostButtonReleased1"),
	},
	reflectButton1 : {
		value : false,
		key : ["Space", "KeyE"],
		eventPressed: new Event("reflectButtonPressed1"),
		eventHold: new Event("reflectButtonHold1"),
		eventReleased: new Event("reflectButtonReleased1"),
	},
	movementAxis2 : {
		value : 0,
		inputStrength : new Vector2( 0, 0 ),
		keyPositive : ["ArrowUp"],
		keyNegative : ["ArrowDown"]
	},
	boostButton2 : {
		value : false,
		key : ["ShiftRight", "Enter"],
		eventPressed: new Event("boostButtonPressed2"),
		eventHold: new Event("boostButtonHold2"),
		eventReleased: new Event("boostButtonReleased2"),
	},
	reflectButton2 : {
		value : false,
		key : ["ControlRight"],
		eventPressed: new Event("reflectButtonPressed2"),
		eventHold: new Event("reflectButtonHold2"),
		eventReleased: new Event("reflectButtonReleased2"),
	}
}

class InputManager {
	constructor() {
		this.setupInputs();
		this.updatable = new Updatable( this );
	}

	onKeyDown( event ) {
		for ( const input in InputMap ) {
			if ( typeof(InputMap[input].value) === typeof(0) ) {
				if ( InputMap[input].keyPositive.includes( event.code ) )
					InputMap[input].inputStrength.x = InputMap[input].inputStrength.y + 1;
				if ( InputMap[input].keyNegative.includes( event.code ) )
					InputMap[input].inputStrength.y = InputMap[input].inputStrength.x + 1;
				InputMap[input].value = InputMap[input].inputStrength.x > InputMap[input].inputStrength.y ? 1 :
									InputMap[input].inputStrength.x < InputMap[input].inputStrength.y ? -1 : 0;
			} else if ( typeof(InputMap[input].value) === typeof(false) ) {
				if ( InputMap[input].key.includes( event.code ) ) {
					InputMap[input].value = true;
					document.dispatchEvent( InputMap[input].eventPressed );
				}
			}
		}


		// if ( InputMap.movementAxis.keyPositive.includes( event.code ) )
		// 	this.inputStrength.x = this.inputStrength.y + 1;
		// if ( InputMap.movementAxis.keyNegative.includes( event.code ) )
		// 	this.inputStrength.y = this.inputStrength.x + 1;
		// InputMap.movementAxis.value = this.inputStrength.x > this.inputStrength.y ? 1 :
		// 					this.inputStrength.x < this.inputStrength.y ? -1 : 0;



		// if ( InputMap.boostButton.key.includes( event.code ) ) {
		// 	InputMap.boostButton.value = true;
		// 	document.dispatchEvent( InputMap.boostButton.eventPressed );
		// }
		// if ( InputMap.reflectButton.key.includes( event.code ) ) {
		// 	InputMap.reflectButton.value = true;
		// 	document.dispatchEvent( InputMap.reflectButton.eventPressed );
		// }

	}

	onKeyUp( event ) {
		
		for ( const input in InputMap ) {
			if ( typeof(InputMap[input].value) === typeof(0) ) {
				if ( InputMap[input].keyPositive.includes( event.code ) )
					InputMap[input].inputStrength.x = 0;
				if ( InputMap[input].keyNegative.includes( event.code ) )
					InputMap[input].inputStrength.y = 0;
				InputMap[input].value = InputMap[input].inputStrength.x > InputMap[input].inputStrength.y ? 1 :
									InputMap[input].inputStrength.x < InputMap[input].inputStrength.y ? -1 : 0;
			} else if ( typeof(InputMap[input].value) === typeof(false) ) {
				if ( InputMap[input].key.includes( event.code ) ) {
					InputMap[input].value = false;
					document.dispatchEvent( InputMap[input].eventReleased );
				}
			}
		}

		// if ( InputMap.movementAxis.keyPositive.includes( event.code ) )
		// 	this.inputStrength.x = 0;
		// if ( InputMap.movementAxis.keyNegative.includes( event.code ) )
		// 	this.inputStrength.y = 0;
		// InputMap.movementAxis.value = this.inputStrength.x > this.inputStrength.y ? 1 :
		// 					this.inputStrength.x < this.inputStrength.y ? -1 : 0;


		// if ( InputMap.boostButton.key.includes( event.code ) ) {
		// 	InputMap.boostButton.value = false;
		// 	document.dispatchEvent( InputMap.boostButton.eventReleased );
		// }
		// if ( InputMap.reflectButton.key.includes( event.code ) ) {
		// 	InputMap.reflectButton.value = false;
		// 	document.dispatchEvent( InputMap.reflectButton.eventReleased );
		// }

	}

	setupInputs() {
		// this.inputStrength = new Vector2( 0, 0 );

		this.onKeyDownEvent = (event) => this.onKeyDown( event );
		this.onKeyUpEvent = (event) => this.onKeyUp( event );

		document.addEventListener('keydown', this.onKeyDownEvent, false);
		document.addEventListener('keyup', this.onKeyUpEvent, false);
	}

	update( dt ) {
		for ( const input in InputMap ) {
			if ( InputMap[input].value === true ) {
				document.dispatchEvent( InputMap[input].eventHold );
			}
		}
		// if ( InputMap.boostButton.value === true )
		// 	document.dispatchEvent( InputMap.boostButton.eventHold );
		// if ( InputMap.boostButton.value === true )
		// 	document.dispatchEvent( InputMap.reflectButton.eventHold );
	}

	delete() {
		document.removeEventListener('keydown', this.onKeyDownEvent, false);
		document.removeEventListener('keyup', this.onKeyUpEvent, false);
		this.updatable.delete();
	}
}

export { InputManager, InputMap };