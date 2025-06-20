import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { AudioLoader, CubeTextureLoader, RepeatWrapping, TextureLoader } from 'three';

import arcadeScene from '/model/arcadeScene.glb?url';
import arcadeCarpet_512 from '/arcade_carpet_512.png?url';
import arcadeCarpet_N from '/GreenCarpet_N.jpg?url';
import glassless_N from '/glassless_normal.jpg?url';
import DSEG from '/fonts/DSEG.json?url';
import dark_spx from '/MilkyWay/dark-s_px.jpg?url';
import dark_snx from '/MilkyWay/dark-s_nx.jpg?url';
import dark_spy from '/MilkyWay/dark-s_py.jpg?url';
import dark_sny from '/MilkyWay/dark-s_ny.jpg?url';
import dark_spz from '/MilkyWay/dark-s_pz.jpg?url';
import dark_snz from '/MilkyWay/dark-s_nz.jpg?url';
import circle from '/circle_04.png?url';

let airHockeyTable;
let floorDiffuse;
let floorNormal;
let glassNormal;
let digitalFont;
let texCube;
let spriteCircle;

const loaderGLTF = new GLTFLoader();
const loaderTexture = new TextureLoader();
const loaderCubeTexture = new CubeTextureLoader();
const loaderFont = new FontLoader();
const loaderAudio = new AudioLoader();

async function loadAll() {
	await loadFile( loaderGLTF, arcadeScene ).then( (res) => airHockeyTable = res );
	await loadFile( loaderTexture, arcadeCarpet_512 ).then( (res) => floorDiffuse = res );
	floorDiffuse.wrapS = RepeatWrapping;
	floorDiffuse.wrapT = RepeatWrapping;
	floorDiffuse.repeat.set( 16, 16 );
	await loadFile( loaderTexture, arcadeCarpet_N ).then( (res) => floorNormal = res );
	floorNormal.wrapS = RepeatWrapping;
	floorNormal.wrapT = RepeatWrapping;
	floorNormal.repeat.set( 16, 16 );
	await loadFile( loaderTexture, glassless_N ).then( (res) => glassNormal = res );
	glassNormal.wrapS = RepeatWrapping;
	glassNormal.wrapT = RepeatWrapping;
	glassNormal.repeat.set( 8, 8 );
	await loadFile( loaderFont, DSEG ).then( (res) => digitalFont = res );
	await loadFile( loaderCubeTexture, [
		dark_spx, dark_snx, 
		dark_spy, dark_sny, 
		dark_spz, dark_snz, 
	] ).then( (res) => texCube = res );
	await loadFile( loaderTexture, circle ).then( (res) => spriteCircle = res );
}

function loadFile( loader, filePath ) {
	return new Promise( resolve => {
		loader.load(
			filePath,
			function ( gltf ) { resolve( gltf ); },
			undefined,
			function ( error ) { console.log(filePath + ' not loaded'); console.error( error ); }
		);

	}, 2000)
}

export { loadAll, airHockeyTable, floorDiffuse, floorNormal, glassNormal, digitalFont, texCube, spriteCircle };