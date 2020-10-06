const axios = require('axios');

module.exports = async (url) => {
  try {
    let response = await axios.get(url);
    let { data } = await response;
    let [server, id] = url
      .replace(
        /.+www([0-9]+)\.zippyshare\.com\/v\/([a-zA-Z0-9]+)\/file\.html/g,
        '$1|||$2'
      )
      .split('|||');
    let filename = data
      .split('document.getElementById(\'dlbutton\').href = "')[1]
      .split(';')[0]
      .replace(
        /\/d\/[a-zA-Z0-9]+\/\"\+\(([0-9]+)\%[a-zA-Z0-9 \+\(\)\/\"]+(\/.+)\"/g,
        '$1|||$2'
      )
      .split('|||')
      .map((x) => (Number(x) ? Math.floor((Number(x) % 1000) + 11) : x))
      .join('');

    return {
      ok: true,
      url: `https://www${server}.zippyshare.com/d/${id}/${filename}`,
    };
  } catch (error) {
    console.log(error);
    return { ok: false, message: error.message };
  }
};
