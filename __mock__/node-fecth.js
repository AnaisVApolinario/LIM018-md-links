/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const fetch = jest.fn((url) => {
  return Promise.resolve({});
});
module.exports = fetch;
