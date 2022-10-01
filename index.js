const func = require('./funciones.js');

// const paths = 'D:\\Laboratoria\\LIM018-md-links\\miReadme.md';
const mdLinks = (path, options) => {
  return new Promise((resolve, reject) => {
    if (!func.isDirectory(path)) {
      if (!func.pathExists(path)) {
        reject(new Error('La ruta ingresada no existe, ingrese una ruta valida !!'));
      }
      const absolute = func.getAbsolutePath(path);
      if (!func.isMd(absolute)) {
        reject(new Error('¡No hay archivos con extencion .md!'));
      }
      const fileRead = func.readFile(absolute);
      const extract = func.extractLinks(fileRead, absolute);
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
// mdLinks('test', { validate: false })
//   .then((result) => {
//     console.log(result);
//   }).catch(() => {
//     console.log('La ruta o directorio no existe, ingrese ruta o directorio valido!!');
//   });
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
