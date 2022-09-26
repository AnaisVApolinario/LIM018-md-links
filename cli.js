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
      console.log('Hola');
    });
}
let validate = argv.includes("--validate");

const arrayObjectsLinksPromise = mdLinks(argv[2], { validate })
  .then((resultado) => {
    return resultado;
  });

if (argv[3] === '--validate' && argv[4] === undefined) {
  mdLinks(argv[2], { validate: true })
    .then((result) => {
      console.log(result);
    });
} else if (argv[3] === '--stats') {
  statsLinks(arrayObjectsLinksPromise)
    .then((stats) => {
      console.log('Total de Links: ', stats.totalLinks);
      console.log('Links Unicos: ', stats.uniqueLinks);
    });
}

if (argv[3] === '--validate' && argv[4] === '--stats') {
  statsLinks(arrayObjectsLinksPromise)
    .then((stats) => {
      console.log('Total de Links: ', stats.totalLinks);
      console.log('Links Unicos: ', stats.uniqueLinks);
    });
  brokenLinks(arrayObjectsLinksPromise)
    .then((result) => {
      console.log('Links Rotos', result);
    });
}
