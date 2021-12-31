let common = [
  'test/bdd/features/**/*.feature', // Specify our feature files
  '--require test/bdd/features/step-definitions/**/*.ts', // Load step definitions
  '--require-module ts-node/register', // Load TypeScript module
  '--format progress-bar', // Load custom formatter
  // '--format node_modules/cucumber-pretty',
  `--format-options '{"snippetInterface": "synchronous"}'`, // Load custom formatter
  '--publish-quiet', // Don't shows publish message
].join(' ');

module.exports = {
  default: common
};