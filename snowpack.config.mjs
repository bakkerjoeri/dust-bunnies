/** @type {import("snowpack").SnowpackUserConfig } */
export default {
	mount: {
		public: "/",
		src: "/dist",
	},
	routes: [
		{
			match: "routes",
			src: ".*",
			dest: "/index.html",
		},
	],
	plugins: ["@snowpack/plugin-svelte", "@snowpack/plugin-typescript"],
	packageOptions: {
		knownEntrypoints: ["svelte"],
	},
};
