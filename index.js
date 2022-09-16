const funciones = require('./funciones.js');
const paths = './miReadme.md';
const mdLinks = (path) =>{
 const absolute = funciones.getAbsolutePath(path);
 if(funciones.isMd(absolute)){
    return new Promise((resolve,reject) => {
        resolve([]);
    })
 }
}
mdLinks(paths)
.then((result) => {
    console.log(result)
})



















// //Ver el estado
// const statusLink = (objUrl) => {
//   const objlinks2 ={}
//   const p = fetch(objUrl)
//   .then(res => {
//     objlinks2.status = res.status;
//     objlinks2.ok = res.ok
//     objlinks2.message = 'Ok';
//     return { ...objUrl, ...objlinks2}
//   })
//   return p;
// }
// statusLink()


