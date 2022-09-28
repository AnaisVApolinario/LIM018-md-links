const func = require('./funciones.js');

// const paths = 'D:\\Laboratoria\\LIM018-md-links\\miReadme.md';
const mdLinks = (path, options) => {
  return new Promise((resolve, reject) => {
    func.fileOrDirectory(path);
    if (!func.pathExists(path)) {
      reject(new Error('La ruta ingresada no existe, ingrese una ruta valida !!'));
    }
    const absolute = func.getAbsolutePath(path);
    if (!func.isMd(absolute)) {
      reject(new Error('¡No hay archivos con extencion .md!'));
    }
    if (!options.validate) {
      resolve(func.extractLinks(absolute));
    }
    resolve(func.validateLinks(absolute));
  });
};
// mdLinks('./miReadme.md', { validate: true })
//   .then((result) => {
//     console.log(result);
//   });
module.exports = mdLinks;
