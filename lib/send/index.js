const axios = require("axios");
const token = process.env.BOT_TOKEN;
const id = process.env.TELEGRAM_ID;
const FormData = require("form-data");
const fs = require("fs");
module.exports = {
  text: (text) => {
    let _text = encodeURIComponent(text);
    axios
      .get(
        `https://api.telegram.org/bot${token}/sendMessage?chat_id=${id}&text=${_text}`
      )
      .then((x) => console.log("sukses"))
      .catch((x) => console.log(x.message));
    return;
  },
  file: async (stream, text) => {
    let payload = new FormData();
    payload.append("chat_id", id);
    payload.append("document", fs.readFileSync(stream), "data.xls");
    payload.append("caption", text || new Date());
    try {
      let res = await axios.post(
        "https://api.telegram.org/bot" + token + "/sendDocument",
        payload,
        {
          headers: payload.getHeaders(),
        }
      );
      return res.data;
    } catch (error) {
      return false;
    }
  },
};
