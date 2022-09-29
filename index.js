const func = require('./funciones.js');

// const paths = 'D:\\Laboratoria\\LIM018-md-links\\miReadme.md';
const mdLinks = (path, options) => {
  return new Promise((resolve, reject) => {
    if (!func.isDirectory(path)) {
      if (!func.pathExists(path)) {
        reject(new Error('La ruta ingresada no existe, ingrese una ruta valida !!'));
      }
      const absolute = func.getAbsolutePath(path);
      if (func.isMd(absolute)) {
        const fileRead = func.readFile(path);
        const extract = func.extractLinks(fileRead, absolute);
        if (!options.validate) {
          resolve(extract);
        }
        resolve(func.validateLinks(extract));
      }
    }
    console.log('soy directorio');
    // const rutaAbsoluta = func.getAbsolutePath(path);
    const arrRutas = func.readDir(path);
    const arrRutasMd = func.fileOrDirectory(arrRutas, path);
    const extract = func.readFile(arrRutasMd);
    if (!options.validate) {
      resolve(extract);
    }
    resolve(func.validateLinks(extract));
  });
};
mdLinks('./miReadme.md', { validate: true })
  .then((result) => {
    console.log('hola', result);
  });
module.exports = mdLinks;
// if (!func.pathExists(path)) {
//   reject(new Error('La ruta ingresada no existe, ingrese una ruta valida !!'));
// }
// const pathAbsolute = func.getAbsolutePath(path);
// console.log("pathAbsolute", pathAbsolute);
// const x = func.readDir(pathAbsolute);
// console.log("x",x)
// const arrPathsMd = func.fileOrDirectory(x, pathAbsolute);
//  console.log(arrPathsMd, 'array');
// const fileRead = func.readFile(arrPathsMd);
// if (!func.isMd(pathAbsolute)) {
//   reject(new Error('¡No hay archivos con extencion .md!'));
// }

// if (!options.validate) {
//   resolve(func.extractLinks(fileRead, pathAbsolute));
// }
// resolve(func.validateLinks(func.extractLinks(fileRead, pathAbsolute)));
