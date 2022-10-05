const func = require('./funciones.js');

const mdLinks = (path, options) => {
  return new Promise((resolve, reject) => {
    if (!func.isDirectory(path)) {
      if (!func.pathExists(path)) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('La ruta ingresada no existe, ingrese una ruta valida !!');
      }
      const absolute = func.getAbsolutePath(path);
      if (!func.isMd(absolute)) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('¡No es un archivo con extencion .md!');
      }
      const fileRead = func.readFile(absolute);
      const extract = func.extractLinks(fileRead, absolute);
      if (extract === []) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('No hay links, o el archivos esta vacio');
      }
      if (!options.validate) {
        resolve(extract);
      }
      resolve(func.validateLinks(extract));
    }
    const rutaAbsoluta = func.getAbsolutePath(path);
    const pathsDir = func.readDir(rutaAbsoluta);
    const pathDir = func.fileOrDirectory(pathsDir, rutaAbsoluta, []);
    const rutasMd = func.filtrarRutasMd(pathDir);
    const arrMultidime = [];
    rutasMd.forEach((md) => {
      const leer = func.readFile(md);
      const extract = func.extractLinks(leer, md);
      arrMultidime.push(extract);
    });
    const arrUnido = arrMultidime.flat();
    if (!options.validate) {
      resolve(arrUnido);
    }
    resolve(func.validateLinks(arrUnido));
  });
};
module.exports = mdLinks;
