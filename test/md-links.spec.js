/* eslint-disable no-undef */
const fetch = require('node-fetch');
const func = require('../funciones.js');

jest.mock('node-fecth.js'); // activamos el mock;

describe('path exists', () => {
  const path = './miReadme.md';
  const path2 = './animalito.png';
  it('pathExists is a function', () => {
    expect(typeof func.pathExists).toBe('function');
  });
  it('the path exists', () => {
    expect(func.pathExists(path)).toBe(true);
  });
  it('the path does not exist', () => {
    expect(func.pathExists(path2)).toBe(false);
  });
});

describe('path is absolute', () => {
  // DADO
  const path = 'D:\\Laboratoria\\LIM018-md-links\\miReadme.md';
  it('ruta absoluta', () => {
    // CUANDO
    func.getAbsolutePath(path);
    // ENTONCES
    expect(func.getAbsolutePath(path)).toBe(path);
  });
  it('convertir ruta relativa a ruta absoluta', () => {
    // DADO
    const path2 = './miReadme.md';
    // CUANDO
    func.getAbsolutePath(path2);
    // ENTONCES
    expect(func.getAbsolutePath(path2)).toBe(path);
  });
});
describe('fetch', () => {
  const arrObj = [{
    href: 'https://yargs.js.org/',
    text: 'Yargs',
    file: './miReadme.md',
  }];
  it.only('fetch', () => {
    func.validateLinks(arrObj)
      .then((result) => {
        expect(result).toEqual([{}]);
      });
  });
});
