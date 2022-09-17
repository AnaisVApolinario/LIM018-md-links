const pathis = './miReadme.md';
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');
// comprobar si el archivo es existe y es md
const isMd = (paths) => {
  // comprobar si existe
  const pathExists = fs.existsSync(paths);
  if (!pathExists) {
    return false;
  }
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
const r = extractLinks(getAbsolutePath(pathis));

const statusLinks = (arrayObjetos) => {
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
statusLinks(r).then((result) => {
  console.log(result);
});

module.exports = {
  isMd,
  getAbsolutePath,
  readFile,
  extractLinks,
  statusLinks,
};