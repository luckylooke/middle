
// Rollup plugins
import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import uglify from 'rollup-plugin-uglify-es';

export default {
	entry: 'src/middle.src.js',
	dest: 'dist/middle.es.js',
	format: 'es',
	sourceMap: true,
	plugins: [
		eslint(),
		babel({
			exclude: 'node_modules/**',
		}),
		uglify()
	],
};