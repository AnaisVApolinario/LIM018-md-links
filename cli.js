#!/usr/bin/env node
const { statsLinks, brokenLinks } = require('./funciones');
const mdLinks = require('./index.js');
// const yargs = require('yargs');
// const chalk = require('chalk');
const argv = process.argv;
console.log(argv);
// const argv = process.argv.slice(2).join();
// console.log(argv);

if (argv[2] !== '') {
  mdLinks(argv[2]);
}
