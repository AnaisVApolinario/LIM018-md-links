const func = require('./funciones.js');

// const paths = 'D:\\Laboratoria\\LIM018-md-links\\miReadme.md';
const mdLinks = (path, options) => {
  return new Promise((resolve, reject) => {
    let links = [];
    if (!func.pathExists(path)) {
      reject(new Error('La ruta ingresada no existe, ingrese una ruta valida !!'));
    }
    const absolute = func.getAbsolutePath(path);
    if (!func.isMd(absolute)) {
      reject(new Error('¡No hay archivos con extencion .md!'));
    }
    const arrayObjetos = func.extractLinks(absolute);
    if (!options.validate) {
      links = arrayObjetos;
      resolve(links);
    }
    links = func.validateLinks(arrayObjetos);
    resolve(links);
  });
};
// mdLinks(paths, { validate: false })
//   .then((result) => {
//     console.log(result);
//   });
module.exports = mdLinks;
