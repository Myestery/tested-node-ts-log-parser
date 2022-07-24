const { Parser } = require('./build/Parser');
const minimist = require("minimist");
const parser = new Parser(
  minimist(process.argv.slice(2)).input,
  minimist(process.argv.slice(2)).output
);
parser.parse();