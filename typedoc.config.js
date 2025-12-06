/** @type {Partial<import("typedoc").TypeDocOptions>} */

const config = {
	entryPoints: ["./src/index.ts"],
	out: "docs/typedoc",
	highlightLanguages: ["ts", "tsx", "js", "jsx", "bash"],
	excludePrivate: true,
	includeVersion: true,
};

export default config;
