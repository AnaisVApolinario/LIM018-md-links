// const pathis = './miReadme.md';
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');
// COMPROBAR SI EL ARCHIVO EXISTE
const pathExists = (paths) => fs.existsSync(paths);

// VER SI LA RUTA ES ABSOLUTA O CONVERTIR LA RUTA RELATIVA EN ABSOLUTA
const getAbsolutePath = (paths) => {
  return path.isAbsolute(paths) ? paths : path.resolve(paths);
};
// VERIFICAR SI ES UN DIRECTORIO
const isDirectory = (pathAbsolute) => fs.lstatSync(pathAbsolute).isDirectory();

// LEER DIRECTORIO
const readDir = (pathAbsolute) => fs.readdirSync(pathAbsolute);

// COMPROBAR SI EL ARCHIVO ES MD
const isMd = (pathAbsolute) => {
  const pathMd = path.extname(pathAbsolute);
  if (pathMd === '.md') {
    return true;
  }
  return false;
};

const fileOrDirectory = (readDirectory, pathAbsolute) => {
  // leer el directorio
  const arrPaths = readDirectory.map((element) => {
    const rutaAbsoluta = path.join(pathAbsolute, element);
    return isDirectory(rutaAbsoluta) ? fileOrDirectory(rutaAbsoluta) : rutaAbsoluta;
  });
  const arrpathsMd = arrPaths.flat().filter((file) => {
    return isMd(file) === true;
  });
  return arrpathsMd;
};
// eslint-disable-next-line max-len
const p = fileOrDirectory(readDir('pruebas/carp_prueba2'), getAbsolutePath('pruebas/carp_prueba2'));

const readFile = (pathsMd) => {
  if (!Array.isArray(pathsMd)) {
    return fs.readFileSync(pathsMd, 'utf-8');
  }
  return pathsMd.map((paath) => {
    return fs.readFileSync(paath, 'utf-8');
  });
};
// console.log(readFile('./miReadme.md'));

const extractLinks = (fileRead, pathMd) => {
  const textHttps = /\[(.+)\]\((https?:\/\/.+)\)/gi;
  const arrayTextHtpps = fileRead.match(textHttps);
  if (fileRead === '') {
    return [];
  }
  if (arrayTextHtpps === null) {
    return [];
  }
  const arrayObjetosLinks = arrayTextHtpps.map((links) => {
    const textLink = /\[[^\s]+(.+?)\]/gi;
    const matchText = links.match(textLink);
    const httpsLink = /\((https?.+?)\)/gi;
    const matchHttp = links.match(httpsLink);
    const objLinks = {
      href: matchHttp[0].slice(1, -1),
      text: matchText[0].slice(1, -1),
      file: pathMd,
    };
    return objLinks;
  });
  return arrayObjetosLinks;
};
// let arr = [];
// readFile(p).forEach((el) => {
//   const o = extractLinks(el, getAbsolutePath('pruebas/carp_prueba2'));
//   arr.push(o);
// });
// console.log(arr.flat()); // array de objetos con 3 links;
// const r = extractLinks(readFile(p), getAbsolutePath('pruebas/carp_prueba2'));
// console.log(r);
const validateLinks = (linksExtract) => {
  const arrayPromesas = linksExtract.map((objLink) => {
    return fetch(objLink.href)
      .then((res) => {
        if (res.status >= 200 && res.status < 400) {
          return {
            ...objLink,
            status: res.status,
            statusText: res.statusText,
            message: 'ok',
          };
        }
        return {
          ...objLink,
          status: res.status,
          statusText: res.statusText,
          message: 'fail',
        };
      });
  });
  return Promise.all(arrayPromesas);
};
// const pi = validateLinks(r)
//   .then((res) => {
//     return res;
//   });

const statsLinks = (linksExtract) => {
  const arrayLinks = linksExtract.map((link) => {
    return link.href;
  });
  const totalLinks = arrayLinks.length;
  const uniqueLinks = [];
  arrayLinks.forEach((link) => {
    if (!uniqueLinks.includes(link)) {
      uniqueLinks.push(link);
    }
  });
  return { totalLinks, uniqueLinks: uniqueLinks.length };
};
// console.log(statsLinks(r));

const brokenLinks = (linksValidate) => {
  return linksValidate.then((objLink) => {
    return objLink.filter((link) => {
      return link.message === 'fail';
    }).length;
  });
};
// brokenLinks(pi)
//   .then((er) => {
//     console.log(er);
//   });

module.exports = {
  pathExists,
  getAbsolutePath,
  isDirectory,
  readDir,
  isMd,
  readFile,
  fileOrDirectory,
  extractLinks,
  validateLinks,
  statsLinks,
  brokenLinks,
};