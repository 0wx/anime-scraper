const axios = require('axios');

module.exports = async (url) => {
  try {
    let response = await axios.get(url);
    let data = response.data.replace(/[\n\t]/g, '');

    let daftar = data.slice(
      data.indexOf('<div class="download-eps">'),
      data.indexOf('<div class="episodeinf widget_senction">')
    );

    let daftarArr = daftar
      .slice('<div class="download-eps">'.length, daftar.lastIndexOf('</div>'))
      .split('</div><div class="download-eps">')
      .map((info) => {
        let _info = info
          .slice(
            info.indexOf('<ul><li style="text-align: center;">'),
            info.lastIndexOf('</li></ul>')
          )
          .replace('<ul><li style="text-align: center;">', '')
          .split('</li><li style="text-align: center;">')
          .map((res) => ({
            resolution: res
              .replace(/<strong>(.+)<\/strong>.+/g, '$1')
              .replace(/[ ]/g, ''),
            url: res
              .replace(/.+<\/strong> <span>(.+)<\/span>/g, '$1')
              .split('</span> <span>')
              .map((url) =>
                url.replace(/<a href=\"(.+)\" target=\"_blank\".+/g, '$1')
              ).filter(x => x.indexOf('<') == -1),
          }));
        return {
          type: info
            .replace(/<p><b>(.+)<\/b><\/p>.+/g, '$1')
            .replace(/[ ]/g, ''),
          data: _info,
        };
      });

    return { ok: true, results: daftarArr };
  } catch (error) {
    console.log(error);
    return { ok: false, message: error.message };
  }
};
