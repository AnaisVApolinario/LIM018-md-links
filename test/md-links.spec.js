/* eslint-disable no-undef */
const fetch = require('node-fetch');
const func = require('../funciones.js');

// jest.mock('node-fecth.js'); // activamos el mock;
jest.mock('node-fetch');

describe('path exists', () => {
  const path = './miReadme.md';
  const path2 = './animalito.png';
  it('pathExists is a function', () => {
    expect(typeof func.pathExists).toBe('function');
  });
  it('the path exists', () => {
    expect(func.pathExists(path)).toBeTruthy();
  });
  it('the path does not exist', () => {
    expect(func.pathExists(path2)).toBeFalsy();
  });
});

describe('path with extension md ', () => {
  const path = './miReadme.md';
  const path2 = './perro.png';

  it('is isMd a function', () => {
    expect(typeof func.isMd).toBe('function');
  });

  it('si es extension md', () => {
    expect(func.isMd(path)).toBeTruthy();
  });

  it('no es extension md', () => {
    expect(func.isMd(path2)).toBeFalsy();
  });
});

describe('extract Links', () => {
  it('archivo esta vacio', () => {
    const path1 = './prueba1.md';
    expect(func.extractLinks(path1)).toEqual([]);
  });

  it('archivo no contiene links', () => {
    const path2 = './prueba2.md';
    expect(func.extractLinks(path2)).toEqual([]);
  });

  it('archivo con links, extraer los link', () => {
    const path = './miReadme.md';
    const objetos = [
      {
        href: 'https://jestjs.io/docs/es-ES/getting-stated',
        text: 'Empezando con Jest - Documentación oficial',
        file: path,
      },
      {
        href: 'https://jestjs.io/docs/es-ES/asynchronous',
        text: 'Tests de código asincrónico con Jest - Documentación oficial',
        file: path,
      },
    ];
    expect(func.extractLinks(path)).toEqual(objetos);
  });
});
describe('validate Links', () => {
  it('hace la consulta http con fecth y retorna un promesas', () => {
    const path = './miReadme.md';
    const arrObj3 = func.validateLinks([
      {
        href: 'https://jestjs.io/docs/es-ES/getting-stated',
        text: 'Empezando con Jest - Documentación oficial',
        file: path,
      },
      {
        href: 'https://jestjs.io/docs/es-ES/asynchronous',
        text: 'Tests de código asincrónico con Jest - Documentación oficial',
        file: path,
      },
    ]);
    const arrayPromise = [
      {
        href: 'https://jestjs.io/docs/es-ES/getting-stated',
        text: 'Empezando con Jest - Documentación oficial',
        file: path,
        status: 404,
        statusText: 'Not Found',
        message: 'fail',
      },
      {
        href: 'https://jestjs.io/docs/es-ES/asynchronous',
        text: 'Tests de código asincrónico con Jest - Documentación oficial',
        file: path,
        status: 200,
        statusText: 'OK',
        message: 'ok',
      },
    ];
    return arrObj3.then((resultado) => {
      expect(resultado).toEqual(arrayPromise);
    });
  });
  it.only('si la peticion falla mostrará un error', () => {
    const path = './miReadme.md';
    fetch.mockRejectedValue(new Error('error message'));
    const objLinksMock = {
      href: 'https://jestjs.io/docs/es-ES/getting-stated',
      text: 'Empezando con Jest - Documentación oficial',
      file: path,
    };

    return func.validateLinks([objLinksMock]).then((res) => {
      expect(res[0]).toEqual(expect.objectContaining({
        status: 404,
        statusText: 'Not Found',
        message: 'fail',
      }));
    });
  });
});
// describe('stats Links', () => {
//   it('Objetos con links totales y unicos', () => {
//     const objetos = [
//       {
//         href: 'https://jestjs.io/docs/es-ES/getting-stated',
//         text: 'Empezando con Jest - Documentación oficial',
//         file: './miReadme.md',
//       },
//       {
//         href: 'https://jestjs.io/docs/es-ES/asynchronous',
//         text: 'Tests de código asincrónico con Jest - Documentación oficial',
//         file: './miReadme.md',
//       },
//     ];
//     expect(func.statsLinks(objetos)).toEqual({ totalLinks: 2, uniqueLinks: 2});
//   });
// })
