import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
	base: "/Sandbox_ThreeJS-Vite/",
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html'),
				pong: resolve(__dirname, 'pong/index.html'),
				unity: resolve(__dirname, 'unity/index.html')
			}
		}
	},
})