const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["./base", "turbo"],
  rules: {
    "@typescript-eslint/no-var-requires": "off",
  },
};
