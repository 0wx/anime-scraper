const axios = require('axios');
const main_url = 'https://www.zippyshare.com';

module.exports = async () => {
  try {
    let response = await axios.get(main_url);
    let { data } = response;
    return {
      ok: true,
      url:
        'https://' +
        data
          .replace(/\n/g, '')
          .replace(/.+\/\/(www[0-9]+\.zippyshare\.com\/upload).+/g, '$1'),
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: error.message,
    };
  }
};
