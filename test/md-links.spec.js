/* eslint-disable no-undef */
const fetch = require('node-fetch');
const func = require('../funciones.js');
const mdLinks = require('../index.js');

jest.mock('node-fetch');

describe('path with extension md ', () => {
  const path = './README.md';
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
    const path1 = 'pruebas/carp_prueba1/prueba1.md';
    expect(func.extractLinks(func.readFile(path1), path1)).toEqual([]);
  });

  it('archivo no contiene links', () => {
    const path2 = 'pruebas/carp_prueba2/prueba2.md';
    expect(func.extractLinks(func.readFile(path2), path2)).toEqual([]);
  });

  it('archivo con links, extraer los link', () => {
    const path = 'pruebas/carp_prueba2/listo.md';
    const objetos = [
      {
        href: 'https://jestjs.io/docs/es-ES/getting-started',
        text: 'Empezando con Jest - Documentación oficial',
        file: path,
      },
      {
        href: 'https://jestjs.io/docs/es-ES/asynchronous',
        text: 'Tests de código asincrónico con Jest - Documentación oficial',
        file: path,
      },
    ];
    expect(func.extractLinks(func.readFile(path), path)).toEqual(objetos);
  });
});
describe('validate Links', () => {
  it('hacer la consulta http con fecth y retorna un promesas', (done) => {
    const path = 'pruebas/carp_prueba2/listo.md';
    const extract = func.extractLinks(func.readFile(path), path);
    const arrPromesas = func.validateLinks(extract);
    const arr = [
      {
        href: 'https://jestjs.io/docs/es-ES/getting-started',
        text: 'Empezando con Jest - Documentación oficial',
        file: 'pruebas/carp_prueba2/listo.md',
        status: 200,
        statusText: 'OK',
        message: 'ok',
      },
      {
        href: 'https://jestjs.io/docs/es-ES/asynchronous',
        text: 'Tests de código asincrónico con Jest - Documentación oficial',
        file: 'pruebas/carp_prueba2/listo.md',
        status: 200,
        statusText: 'OK',
        message: 'ok',
      },
    ];
    arrPromesas
      .then((result) => {
        expect(result).toStrictEqual(arr);
        done();
      });
  });
  it('hacer la peticion con fecth y reterona fallido', () => {
    const arrayParam = [
      {
        href: 'https://jestjs.io/docs/es-ES/getting-started',
        text: 'Empezando con Jest - Documentación oficial',
        file: 'D:\\LABORATORIA\\md-links\\LIM018-md-links\\miReadme.md',
      },
      {
        href: 'https://jestjs.io/docs/es-ES/asynchronous',
        text: 'Tests de código asincrónico con Jest - Documentación oficial',
        file: 'D:\\LABORATORIA\\md-links\\LIM018-md-links\\miReadme.md',
      },
      {
        href: 'https://jestjs.io/docs/es-ES/asynchronous',
        text: 'Tests de código asincrónico con Jest - Documentación oficial',
        file: 'D:\\LABORATORIA\\md-links\\LIM018-md-links\\miReadme.md',
      },
    ];
    const arrResult = [
      {
        href: 'https://jestjs.io/docs/es-ES/getting-started',
        text: 'Empezando con Jest - Documentación oficial',
        file: 'D:\\LABORATORIA\\md-links\\LIM018-md-links\\miReadme.md',
        status: 400,
        statusText: 'fail',
        message: 'fail',
      },
      {
        href: 'https://jestjs.io/docs/es-ES/asynchronous',
        text: 'Tests de código asincrónico con Jest - Documentación oficial',
        file: 'D:\\LABORATORIA\\md-links\\LIM018-md-links\\miReadme.md',
        status: 200,
        statusText: 'OK',
        message: 'ok',
      },
      {
        href: 'https://jestjs.io/docs/es-ES/asynchronous',
        text: 'Tests de código asincrónico con Jest - Documentación oficial',
        file: 'D:\\LABORATORIA\\md-links\\LIM018-md-links\\miReadme.md',
        status: 200,
        statusText: 'OK',
        message: 'ok',
      },
    ];
    fetch.mockResolvedValueOnce({ status: 400, statusText: 'fail' });
    func.validateLinks(arrayParam).then((result) => {
      expect(result).toEqual(arrResult);
    });
  });
});
describe('stats Links', () => {
  it('Objetos con links totales y unicos', () => {
    const path = 'pruebas/carp_prueba2/listo.md';
    const objetos = [
      {
        href: 'https://jestjs.io/docs/es-ES/getting-started',
        text: 'Empezando con Jest - Documentación oficial',
        file: path,
      },
      {
        href: 'https://jestjs.io/docs/es-ES/asynchronous',
        text: 'Tests de código asincrónico con Jest - Documentación oficial',
        file: path,
      },
    ];
    expect(func.statsLinks(objetos)).toEqual({ totalLinks: 2, uniqueLinks: 2 });
  });
});

describe('Archivos en directorios', () => {
  it('leer directorios', () => {
    // eslint-disable-next-line max-len
    // const files = ['carp_prueba1', 'break.md', 'prueba1.md', 'script.js', 'carp_prueba2', 'listo.md', 'masLinks.md', 'prueba2.md', 'rox.txt', 'repeat.md'];
    const files = ['carp_prueba1', 'carp_prueba2', 'repeat.md'];
    expect(func.readDir('pruebas')).toEqual(files);
  });
  it('extraer archivos de todas las carpetas', () => {
    // const files = ['carp_prueba1', 'carp_prueba2', 'repeat.md'];
    const arrFile = func.readDir('pruebas');
    expect(func.fileOrDirectory(arrFile, 'pruebas', [])).toEqual([
      'pruebas\\carp_prueba1\\break.md',
      'pruebas\\carp_prueba1\\prueba1.md',
      'pruebas\\carp_prueba2\\listo.md',
      'pruebas\\carp_prueba2\\prueba2.md',
      'pruebas\\carp_prueba2\\rox.txt',
      'pruebas\\repeat.md',
    ]);
  });
  it('array de archivos md', () => {
    const arrFiles = [
      'pruebas\\carp_prueba1\\break.md',
      'pruebas\\carp_prueba1\\prueba1.md',
      'pruebas\\carp_prueba2\\listo.md',
      'pruebas\\carp_prueba2\\prueba2.md',
      'pruebas\\carp_prueba2\\rox.txt',
      'pruebas\\repeat.md',
    ];
    expect(func.filtrarRutasMd(arrFiles)).toEqual([
      'pruebas\\carp_prueba1\\break.md',
      'pruebas\\carp_prueba1\\prueba1.md',
      'pruebas\\carp_prueba2\\listo.md',
      'pruebas\\carp_prueba2\\prueba2.md',
      'pruebas\\repeat.md',
    ]);
  });
});

describe('Md Links', () => {
  it('imprimir en consola el link sin validar', () => {
    const path = 'pruebas/carp_prueba2/listo.md';
    const mdlinks = mdLinks(path, { validate: false });
    const sinValidate = [
      {
        href: 'https://jestjs.io/docs/es-ES/getting-started',
        text: 'Empezando con Jest - Documentación oficial',
        file: 'D:\\Laboratoria\\LIM018-md-links\\pruebas\\carp_prueba2\\listo.md',
      },
      {
        href: 'https://jestjs.io/docs/es-ES/asynchronous',
        text: 'Tests de código asincrónico con Jest - Documentación oficial',
        file: 'D:\\Laboratoria\\LIM018-md-links\\pruebas\\carp_prueba2\\listo.md',
      },
    ];
    mdlinks
      .then((result) => {
        expect(result).toEqual(sinValidate);
      });
  });
  it('imprimir en consola el link sin validar', () => {
    const path = 'pruebas/carp_prueba2/listo.md';
    const mdlinks = mdLinks(path, { validate: false });
    const sinValidate = [
      {
        href: 'https://jestjs.io/docs/es-ES/getting-started',
        text: 'Empezando con Jest - Documentación oficial',
        file: 'D:\\Laboratoria\\LIM018-md-links\\pruebas\\carp_prueba2\\listo.md',
      },
      {
        href: 'https://jestjs.io/docs/es-ES/asynchronous',
        text: 'Tests de código asincrónico con Jest - Documentación oficial',
        file: 'D:\\Laboratoria\\LIM018-md-links\\pruebas\\carp_prueba2\\listo.md',
      },
    ];
    mdlinks
      .then((result) => {
        expect(result).toEqual(sinValidate);
      });
  });
  it('imprimir en consola el link validado', () => {
    const path = 'pruebas/carp_prueba2/listo.md';
    const mdlinks = mdLinks(path, { validate: true });
    const validate = [
      {
        href: 'https://jestjs.io/docs/es-ES/getting-started',
        text: 'Empezando con Jest - Documentación oficial',
        file: 'D:\\Laboratoria\\LIM018-md-links\\pruebas\\carp_prueba2\\listo.md',
        status: 200,
        statusText: 'OK',
        message: 'ok',
      },
      {
        href: 'https://jestjs.io/docs/es-ES/asynchronous',
        text: 'Tests de código asincrónico con Jest - Documentación oficial',
        file: 'D:\\Laboratoria\\LIM018-md-links\\pruebas\\carp_prueba2\\listo.md',
        status: 200,
        statusText: 'OK',
        message: 'ok',
      },
    ];
    mdlinks
      .then((result) => {
        expect(result).toEqual(validate);
      });
  });
});
