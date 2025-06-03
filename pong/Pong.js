import './style.css';

import { World } from './World.js';
import { loadAll } from './systems/Loader.js';

async function init() {
	console.log('Start Init');
    await loadAll()
	console.log('Loaded');
    const gameContainer = document.querySelector('#bg')
    if (!gameContainer) {
        console.error('No game container, please refresh page.');
        return
    }
    const world = new World(gameContainer);
    // initGameMenu(world);
}

init();
