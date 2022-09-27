/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const fetch = jest.fn(() => {
  return Promise.resolve(
    {
      status: 404,
      statusText: 'Not Found',
      message: 'fail',
    },
    {
      status: 200,
      statusText: 'OK',
      message: 'ok',
    },
  );
});
module.exports = fetch;
