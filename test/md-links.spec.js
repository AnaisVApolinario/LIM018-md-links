/* eslint-disable no-undef */
const mdLinks = require('../funciones.js');

describe('mdLinks', () => {
  // DADO
  const path = 'D:\\Laboratoria\\LIM018-md-links\\miReadme.md';
  it('ruta absoluta', () => {
    // CUANDO
    mdLinks.getAbsolutePath(path);
    // ENTONCES
    expect(mdLinks.getAbsolutePath(path)).toBe(path);
  });
  it('convertir ruta relativa a ruta absoluta', () => {
    // DADO
    const path2 = './miReadme.md';
    // CUANDO
    mdLinks.getAbsolutePath(path2);
    // ENTONCES
    expect(mdLinks.getAbsolutePath(path2)).toBe(path);
  });
});
