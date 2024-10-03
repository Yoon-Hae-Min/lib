const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["./base"],
  rules: {
    "@typescript-eslint/no-var-requires": "off",
  },
};
