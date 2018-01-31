export default {
	input: "src/rollup-plugin-spl.js",
	external: ["rollup-pluginutils", "fs", "splconfigurator", "rollup-plugin-metascript", "rollup", ],
	output: [{
			file: "target/rollup-plugin-spl.cjs.js",
			format: "cjs",
		},
		{
			file: "target/rollup-plugin-spl.es.js",
			format: "es",
		},
	],
};