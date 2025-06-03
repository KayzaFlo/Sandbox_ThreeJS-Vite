import { BasicShadowMap, PCFShadowMap, PCFSoftShadowMap, WebGLRenderer } from 'three';

function createRenderer(canvas) {
	const renderer = new WebGLRenderer({ canvas: canvas, antialias: true });
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = PCFSoftShadowMap;

	return renderer;
}

export { createRenderer };
