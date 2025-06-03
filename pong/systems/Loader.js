import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { AudioLoader, CubeTextureLoader, RepeatWrapping, TextureLoader } from 'three';

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
	await loadFile( loaderGLTF, '/model/arcadeScene.glb' ).then( (res) => airHockeyTable = res );
	await loadFile( loaderTexture, '/arcade_carpet_512.png' ).then( (res) => floorDiffuse = res );
	floorDiffuse.wrapS = RepeatWrapping;
	floorDiffuse.wrapT = RepeatWrapping;
	floorDiffuse.repeat.set( 16, 16 );
	await loadFile( loaderTexture, '/GreenCarpet_N.jpg' ).then( (res) => floorNormal = res );
	floorNormal.wrapS = RepeatWrapping;
	floorNormal.wrapT = RepeatWrapping;
	floorNormal.repeat.set( 16, 16 );
	await loadFile( loaderTexture, '/glassless_normal.jpg' ).then( (res) => glassNormal = res );
	glassNormal.wrapS = RepeatWrapping;
	glassNormal.wrapT = RepeatWrapping;
	glassNormal.repeat.set( 8, 8 );
	await loadFile( loaderFont, '/fonts/DSEG.json' ).then( (res) => digitalFont = res );
	await loadFile( loaderCubeTexture, [
		'/MilkyWay/dark-s_px.jpg', '/MilkyWay/dark-s_nx.jpg', 
		'/MilkyWay/dark-s_py.jpg', '/MilkyWay/dark-s_ny.jpg', 
		'/MilkyWay/dark-s_pz.jpg', '/MilkyWay/dark-s_nz.jpg', 
	] ).then( (res) => texCube = res );
	await loadFile( loaderTexture, '/circle_04.png' ).then( (res) => spriteCircle = res );
}

function loadFile( loader, filePath ) {
	return new Promise( resolve => {
		loader.load(
			filePath,
			function ( gltf ) { resolve( gltf ); },
			undefined,
			function ( error ) { console.error( error ); }
		);

	}, 2000)
}

export { loadAll, airHockeyTable, floorDiffuse, floorNormal, glassNormal, digitalFont, texCube, spriteCircle };