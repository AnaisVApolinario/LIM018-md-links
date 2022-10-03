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

// FILTRAR LOS ARCHIVOS A PARTIR DE UN ARRAY DE ARCHIVOS
const fileOrDirectory = (pathContent, pathDir, result) => {
  for (let i = 0; i < pathContent.length; i++) {
    const absolutePath = path.join(pathDir, pathContent[i]);

    if (!isDirectory(absolutePath)) {
      result.push(absolutePath);
    } else {
      fileOrDirectory(readDir(absolutePath), absolutePath, result);
    }
  }
  return result;
};

// FILTRAR ARCHIVOS MD
const filtrarRutasMd = (rutas) => {
  return rutas.filter((ruta) => {
    return isMd(ruta) === true;
  });
};

// LEER ARCHIVOS
const readFile = (pathsMd) => {
  if (!Array.isArray(pathsMd)) {
    return fs.readFileSync(pathsMd, 'utf-8');
  }
  return pathsMd.map((paath) => {
    return fs.readFileSync(paath, 'utf-8');
  });
};

// EXTRAER LINKS DE LOS ARCHIVOS
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

// VALIDAR LINKS DE LOS ARCHIVOS
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

// VER CUANTOS LINKS HAY Y CUANTOS SON UNICOS.
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

// VER CUANTOS LINKS ESTAN ROTOS
const brokenLinks = (linksValidate) => {
  return linksValidate.filter((link) => {
    return link.message === 'fail';
  }).length;
};

module.exports = {
  pathExists,
  getAbsolutePath,
  isDirectory,
  readDir,
  isMd,
  filtrarRutasMd,
  readFile,
  fileOrDirectory,
  extractLinks,
  validateLinks,
  statsLinks,
  brokenLinks,
};