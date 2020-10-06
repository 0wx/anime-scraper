const axios = require('axios');
const time = require('../time');
const gagal = 'Maaf tidak ada episode';
const exp = '.+"eps"><a href="(.+)">([0-9]+)</a>.+"date">(.+)</span>.+';

module.exports = async (url) => {
  try {
    let response = await axios.get(url);
    if (response.data.indexOf(gagal) > -1) {
      return { ok: false, message: 'no episode' };
    }

    let { data } = response;
    let results = data.replace(/\n\t/g, '');
    results = results
      .slice(results.indexOf('<li>'), results.lastIndexOf('</li><ul>') + 5)
      .split('</li>')
      .filter((x) => !!x)
      .map((x) => ({
        url: x.replace(new RegExp(exp, 'g'), '$1'),
        episode: Number(x.replace(new RegExp(exp, 'g'), '$2')),
        date: time(x.replace(new RegExp(exp, 'g'), '$3')),
      }));
    return { ok: true, results };
  } catch (error) {
    return { ok: false, message: error.message };
  }
};
