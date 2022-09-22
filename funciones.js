// const pathis = './miReadme.md';
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');
// comprobar si el archivo existe
const pathExists = (paths) => fs.existsSync(paths);

// comprobar si el archivo es md
const isMd = (paths) => {
  // verificar si es md
  const pathMd = path.extname(paths);
  if (pathMd === '.md') {
    return true;
  }
  return false;
};

// console.log(isMd(path, {validate: false, stats: true}));

// ver si la ruta es absoluta o convertir la ruta relativa en  absoluta
const getAbsolutePath = (paths) => {
  return path.isAbsolute(paths) ? paths : path.resolve(paths);
};

// Leer el archivo
const readFile = (fileAbsolutePath) => {
  return fs.readFileSync(fileAbsolutePath, 'utf-8');
};
// console.log(readFile(getAbsolutePath(pathis)));

const extractLinks = (pathAbsolute) => {
  const textHttps = /\[(.+)\]\((https?:\/\/.+)\)/gi;
  const readFileAbsolutePath = readFile(pathAbsolute);
  const arrayTextHtpps = readFileAbsolutePath.match(textHttps);
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
// const r = extractLinks(getAbsolutePath(pathis));

const validateLinks = (arrayObjetos) => {
  // const arrayObjects = extractLinks(paths);
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
// const va = validateLinks(r).then((result) => {
//   return result;
// });

const statsLinks = (arrObjLinks) => {
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
// statsLinks(va)
//   .then((re) => {
//     console.log(re);
//   });

const brokenLinks = (arrObjLinks) => {
  return arrObjLinks.then((objLink) => {
    return objLink.filter((link) => {
      return link.message === 'fail';
    }).length;
  });
};
// brokenLinks(va)
//   .then((e) => {
//     console.log(e);
//   });

module.exports = {
  pathExists,
  getAbsolutePath,
  isMd,
  readFile,
  extractLinks,
  validateLinks,
  statsLinks,
  brokenLinks,
};