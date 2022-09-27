// const pathis = './miReadme.md';
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');
// // Lee el contenido del directorio
// const readDir = (paths) => fs.readdirSync(paths);

// // VERIFICAR SI ES UN DIRECTORIO
// const isDirectory = (paths) => fs.lstatSync(paths).isDirectory();

// // VERIFICAR SI ES UN ARCHIVO
// const isFile = (paths) => fs.lstatSync(paths).isFile();

// COMPROBAR SI EL ARCHIVO EXISTE
const pathExists = (paths) => fs.existsSync(paths);

// COMPROBAR SI EL ARCHIVO ES MD
const isMd = (paths) => {
  // verificar si es md
  const pathMd = path.extname(paths);
  if (pathMd === '.md') {
    return true;
  }
  return false;
};

// console.log(isMd(path, {validate: false, stats: true}));

// VER SI LA RUTA ES ABSOLUTA O CONVERTIR LA RUTA RELATIVA EN ABSOLUTA
const getAbsolutePath = (paths) => {
  return path.isAbsolute(paths) ? paths : path.resolve(paths);
};

// console.log(readFile(getAbsolutePath(pathis)));
const extractLinks = (pathAbsolute) => {
  const textHttps = /\[(.+)\]\((https?:\/\/.+)\)/gi;
  const readFileAbsolutePath = fs.readFileSync(pathAbsolute, 'utf-8');
  const arrayTextHtpps = readFileAbsolutePath.match(textHttps);
  if (readFileAbsolutePath === '') {
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
      file: pathAbsolute,
    };
    return objLinks;
  });
  return arrayObjetosLinks;
};
// const r = extractLinks(getAbsolutePath('./miReadme.md'));
// console.log(r);

const validateLinks = (paths) => {
  const arrayObjetos = extractLinks(paths);
  const arrayPromesas = arrayObjetos.map((objLink) => {
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
// validateLinks('./miReadme.md')
//   .then((r) => {
//      console.log(r);
//   });
const statsLinks = (paths) => {
  const arrObjLinks = validateLinks(paths);
  return arrObjLinks.then((objLink) => {
    const arrayLinks = objLink.map((link) => {
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
  });
};
// statsLinks('./miReadme.md').then((r) => {
//   console.log(r);
// });

const brokenLinks = (paths) => {
  const arrObjLinks = validateLinks(paths);
  return arrObjLinks.then((objLink) => {
    return objLink.filter((link) => {
      return link.message === 'fail';
    }).length;
  });
};
// brokenLinks('./miReadme.md')
//   .then((r) => {
//     console.log(r);
//   });

module.exports = {
  pathExists,
  getAbsolutePath,
  isMd,
  extractLinks,
  validateLinks,
  statsLinks,
  brokenLinks,
};