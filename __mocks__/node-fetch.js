/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const fetch = jest.fn(() => {
  return Promise.resolve(
    {
      status: 200,
      statusText: 'OK',
    },
  );
});
module.exports = fetch;
//
