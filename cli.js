#!/usr/bin/env node
const { statsLinks, brokenLinks } = require('./funciones');
const chalk = require('chalk');
const mdLinks = require('./index.js');

const argv = process.argv;
// const argv = process.argv.slice(2).join();
// argv[0] = ruta de node
// argv[1] = ruta de mdLinks
// argv[2] = ruta del archivo
// argv[3] = --validate
// argv[4] = --stats

if (argv[2] === undefined) {
  console.log(chalk.red.italic('Por favor ingrese la ruta del archivo'));
}

if (argv.length === 3 && argv[3] === undefined) {
  mdLinks(argv[2], { validate: false })
    .then((result) => {
      console.log(chalk.italic('        ***LINKS FOUND***         '));
      console.log('       =================         ');
      console.log(result);
    })
    .catch(() => {
      console.log(chalk.red.italic('El archivo no contiene links'));
    });
}
if (argv[3] === '--validate') {
  mdLinks(argv[2], { validate: true })
    .then((result) => {
      console.log(result);
    });
}
if (argv[3] === '--stats') {
  mdLinks(argv[2], { validate: true })
    .then((resultado) => {
      console.log(statsLinks());
      console.log(statsLinks(resultado));
    });
}
