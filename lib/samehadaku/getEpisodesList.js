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
    let type = results
      .split('<span><b>Type</b>')[1]
      .split('</span>')[0]
      .replace(/ /g, '');

    if (type.toLowerCase() != 'movie') {
      results = results
        .slice(results.indexOf('<li>'), results.lastIndexOf('</li><ul>') + 5)
        .split('</li>')
        .filter((x) => !!x)
        .map((x) => ({
          url:
            x.replace(new RegExp(exp, 'g'), '$1').indexOf('<') == -1
              ? x.replace(new RegExp(exp, 'g'), '$1')
              : x
                  .replace(new RegExp(exp, 'g'), '$1')
                  .replace(/.+https:\/\/samehadaku[a-zA-Z\/\.0-9]+">.+/),
          episode: Number(x.replace(new RegExp(exp, 'g'), '$2')),
          date:
            time(x.replace(new RegExp(exp, 'g'), '$3')) < 0
              ? 0
              : time(x.replace(new RegExp(exp, 'g'), '$3')),
        }));
    } else {
      results = results
        .slice(results.indexOf('<li>'), results.lastIndexOf('</li><ul>') + 5)
        .split('</li>')
        .filter((x) => !!x)
        .map((x, i) => {
          let tmp_e = x
            .split('<div class="epsleft"><span class="lchx">')[0]
            .split('/span></div>')[0];

          return {
            url: tmp_e
              .split('li><div class="epsright"><span class="eps"><a href="')[1]
              .split('">')[0],
            episode: i + 1,
            date: time(x.replace(/.+class="date">(.+)<\/span><\/div>/g, '$1')),
          };
        });
    }
    return { ok: true, results };
  } catch (error) {
    return { ok: false, message: error.message };
  }
};
