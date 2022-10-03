#!/usr/bin/env node
const chalk = require('chalk');
const { statsLinks, brokenLinks } = require('./funciones.js');

const mdLinks = require('./index.js');
// argv[0] = ruta de node
// argv[1] = ruta de mdLinks
// argv[2] = ruta del archivo
// argv[3] = --validate
// argv[4] = --stats

const argv = process.argv.slice(2);

const arrSinValSt = argv.filter((element) => {
  return element !== '--stats' && element !== '--validate';
});
const validate = argv.includes('--validate');
const stats = argv.includes('--stats');
arrSinValSt.forEach((path) => {
  if (!stats) {
    mdLinks(path, { validate })
      .then((result) => {
        console.log(result);
      }).catch(() => {
        console.log(chalk.red.italic('Ingrese una ruta valida, por favor!!'));
      });
  }

  if (stats && !validate) {
    mdLinks(path, { validate })
      .then((result) => {
        console.log(statsLinks(result));
        console.log('Total de Links: ', chalk.green(statsLinks(result).totalLinks));
        console.log('Links Unicos: ', chalk.green(statsLinks(result).uniqueLinks));
      });
  }
  if (stats && validate) {
    mdLinks(path, { validate })
      .then((result) => {
        console.log('Total de Links:', statsLinks(result).totalLinks);
        console.log('Links Unicos:', statsLinks(result).uniqueLinks);
        console.log('Links Rotos: ', brokenLinks(result));
      });
  }
});

// statsLinks(path)
// .then((obj) => {
//   console.log(chalk.blue.italic('Links Totales: ', chalk.green(obj.totalLinks)));
//   console.log(chalk.blue.italic('Links Unicos: ', chalk.green(obj.uniqueLinks)));
// });
// brokenLinks(path)
// .then((result) => {
//   console.log(chalk.red.italic('Links Rotos: ', chalk.red(result)));
// });
