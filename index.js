// const funciones = require('./funciones.js');

// const paths = './miReadme.md';
// const mdLinks = (path) => {
//   return new Promise((resolve, reject) => {
//   const absolute = funciones.getAbsolutePath(path);
//   if (funciones.isMd(absolute)) {
//     return new Promise((resolve) => {
//       funciones.extractLinks(funciones.readFile(absolute));
//       resolve([]);
//     });
//   }
// };
// mdLinks(paths)
//   .then((result) => {
//     console.log(result);
//   });
