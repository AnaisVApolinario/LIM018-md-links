#!/usr/bin/env node
// const mdLinks = require('./index.js');
const yargs = require('yargs');
const chalk = require('chalk');

const argv = yargs(process.argv.slice(2)).argv;
console.log(argv);

if (argv.stats === 'total:2') {
  console.log(chalk.green.inverse('total de links'));
} else {
  console.log('no hay links');
}
// const [,, ...args] = process.argv;
// console.log(`Hello Word ${args}`);
