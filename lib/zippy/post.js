const axios = require('axios');
const form_data = require('form-data');
const get = require('./get');

module.exports = async (filename, buffer) => {
  try {
    let form = new form_data(),
      link = new RegExp(`.+(https?:\/\/.+/v/[a-zA-Z0-9]+\/file\.html).+`, 'gi'),
      home = await get();
    if (!home.ok) throw new Error('Cannot get server to upload');

    let { url } = home;

    form.append('name', filename);
    form.append('notprivate', 'true');
    form.append('zipname', '');
    form.append('ziphash', '');
    form.append('embPlayerValues', 'false');
    form.append('file', buffer, filename);

    const response = await axios.post(url, form, {
      headers: form.getHeaders(),
    });

    const { data } = await response;
    return {
      ok: true,
      url: data.replace(/\n/g, '').replace(link, '$1'),
    };
  } catch (error) {
    console.log(error);
    return { ok: false, message: error.message };
  }
};
