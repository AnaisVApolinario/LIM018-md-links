const fetch = require('node-fetch')
const path = require('path');
const fs = require('fs');
const paths = './miReadme.md';

// ver si la ruta es absoluta
// convertir la ruta relativa en  absoluta
const getAbsolutePath = (pathToResolve) => {
  return path.isAbsolute(pathToResolve) ?pathToResolve : path.resolve(pathToResolve)
}
const isMd = (paths) => {
  const pathExists = fs.existsSync(paths);
  if(!pathExists){
    console.error('La ruta no existe!')
    return
  }

  const pathAbsolute = getAbsolutePath(paths)
  
  // extraer la extencion que tiene el archivo
  const pathMd = path.extname(pathAbsolute);
  if(pathMd == '.md'){
    return pathAbsolute
  } else console.log('El archivo no es md');
}

// console.log(isMd(path, {validate: false, stats: true}));

const readFile = (file) => {
  return fs.readFileSync(file,'utf-8');
}

const extractLinks = (paths) => {
  const regExp = /\[(.+)\]\((https?:\/\/.+)\)/gi;
  const fileMd = isMd(paths);
  const fileLinks = readFile(fileMd).match(regExp);
  if (fileLinks === null) {
    return [];
  }
  const newFilelinks= fileLinks.map((links) => {
    const textLink = /\[[^\s]+(.+?)\]/gi;
    const matchText = links.match(textLink)
    const httpsLink = /\((https?.+?)\)/gi;
    const matchHttp = links.match(httpsLink);
    const objLinks = {
      href : matchHttp[0].slice(1,-1),
      text: matchText[0].slice(1,-1),
      file: paths
    }
    return objLinks;
});
return newFilelinks;
}

const statusLinks = (paths) => {
  const arrayObjects= extractLinks(paths);
  const arrayLinks = [];
  arrayObjects.forEach((objLink) => {
    fetch(objLink.href)
      .then(res => {
        if(res.status < 400){
          const objLinks2 = {
            status: res.status,
            statusText: res.statusText 
          }
          arrayLinks.push(objLinks2);
          console.log(arrayLinks);
        }
      })
      .catch( (err) => {
        console.log(err)
      })
  })
  console.log('u'+ arrayLinks)
  // fetch (arrayLinks)
  //   .then( res => {
  //     objLinks2.status = res.status;
  //     objLinks2.statusText=res.statusText;
  //   })
  // const arrayPromises = linksExtract.map(fetch(paths.href)
  //   .then(res =>{
  //     objLinks2.status=res.status;
  //     objLinks2.statusText=res.statusText;
  //   })
  //   .catch(err => console.error(err))
  // );
    // return Promise.all(newFilelinks).then(res => console.log(res));
};
statusLinks(paths)
// const linksExtract= extractLinks(paths);
//   linksExtract.map(link => {
//     return statusLinks(link);
// })                                            
// console.log(extractLinks(paths));
  
  module.exports = { getAbsolutePath }


















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


