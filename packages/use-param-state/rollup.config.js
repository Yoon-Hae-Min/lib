const babel = require("@rollup/plugin-babel");
const commonjs = require("@rollup/plugin-commonjs");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const terser = require("@rollup/plugin-terser");
const analyze = require("rollup-plugin-analyzer");
const dts = require("rollup-plugin-dts").default;

const extensions = [".js", ".jsx", ".ts", ".tsx"];

module.exports = [
  {
    input: "src/index.ts",
    output: [
      {
        file: "./dist/bundle.js",
        format: "cjs",
      },
      {
        file: "./dist/bundle.mjs",
        format: "es",
      },
    ],
    plugins: [
      nodeResolve({ extensions }),
      commonjs(),
      terser(),
      analyze(),
      babel({ extensions, babelHelpers: "bundled" }),
    ],
    external: ["react", "react-dom","react-router-dom"],
  },
  {
    input: "src/index.ts",
    output: {
      file: "./dist/index.d.ts",
      format: "es",
    },
    plugins: [dts()],
  },
];
