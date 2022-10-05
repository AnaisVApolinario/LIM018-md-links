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
  return element !== '--stats' && element !== '--validate' && element !== '--help';
});
const validate = argv.includes('--validate');
const stats = argv.includes('--stats');
const help = argv.includes('--help');
if (arrSinValSt.length === 0 && !help) {
  console.log(chalk.cyan('Porfavor ingrese la ruta o archivo que desea analizar'));
  console.log(chalk.italic.cyanBright(`** Para mayor información escriba ${chalk.italic.redBright.bold('--help')}, para revisar las distintas opciones **`));
}

if (help) {
  console.log(`
  🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹    ${chalk.red('OPCIONES')}    🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹

  🔸 ${chalk.cyan('md-links')} ${chalk.green.bold('<path>')} 💨 Path hace referencia al archivo o directorio que desees \n     analizar.'

  🔸 ${chalk.cyan('md-links <path>')} ${chalk.green.bold('--validate')} 💨 Esta opción se hace la petición HTTP.

  🔸 ${chalk.cyan('md-links <path>')} ${chalk.green.bold('--stats')} 💨 Esta opción obtendra las estadísticas de los links \n     encontrados, como  el total de links y los links unicos.

  🔸 ${chalk.cyan('md-links <path>')} ${chalk.green.bold('--validate --stats')} o ${chalk.green.bold('--stats --validate')} 💨 Esta  opción \n     obtendra las estadísticas de los links encontrados, como el \n     total de links, los links unicos y links rotos.'

  🔸 ${chalk.cyan('md-links')} ${chalk.green.bold('--help')} 💨 Muestra informacion acerca de las distintas opciones.'

                            ${chalk.italic.magenta('🔅🔅🔅 by AnaisVA 🔅🔅🔅')}
  `);
}
arrSinValSt.forEach((path) => {
  if (!stats) {
    mdLinks(path, { validate })
      .then((result) => {
        result.forEach((obj) => {
          console.log(`
          ${chalk.cyan('===============================')}
                 ${chalk.cyan('LINKS ENCONTRADOS')}    
          ${chalk.cyan('===============================')}       
          `);
          if (!validate) {
            console.log(chalk.italic.yellow('Href:'), obj.href);
            console.log(chalk.italic.yellow('Text:'), obj.text);
            console.log(chalk.italic.yellow('File:'), obj.file);
          } else {
            console.log(chalk.italic.yellow('Href:'), obj.href);
            console.log(chalk.italic.yellow('Text:'), obj.text);
            console.log(chalk.italic.yellow('File:'), obj.file);
            console.log(chalk.italic.yellow('Status:'), obj.status);
            console.log(chalk.italic.yellow('Status Text:'), obj.statusText);
          }
        });
      }).catch((error) => {
        console.log(chalk.red.italic(error));
      });
  }
  if (stats && !validate) {
    mdLinks(path, { validate })
      .then((result) => {
        console.log(chalk.italic.bold.cyan('   ESTADISTICA DE LOS LINKS   '));
        console.log(chalk.yellow('============================='));
        console.log('🔰', chalk.yellow(' Total de Links: '), chalk.greenBright(statsLinks(result).totalLinks));
        console.log('🔰', chalk.yellow(' Links Unicos: '), chalk.greenBright(statsLinks(result).uniqueLinks));
      });
  }
  if (stats && validate) {
    mdLinks(path, { validate })
      .then((result) => {
        console.log(chalk.italic.bold.cyan('   ESTADISTICA DE LOS LINKS COMPLETA  '));
        console.log(chalk.yellow('======================================='));
        console.log('🔰', chalk.yellow(' Total de Links: '), chalk.greenBright(statsLinks(result).totalLinks));
        console.log('🔰', chalk.yellow(' Links Unicos: '), chalk.greenBright(statsLinks(result).uniqueLinks));
        console.log('🔰', chalk.yellow(' Links Rotos: '), chalk.greenBright(brokenLinks(result)));
      });
  }
});
