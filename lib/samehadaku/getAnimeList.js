const axios = require('axios');
const main_url = 'https://samehadaku.vip/a-z/?letter=';
const pagination_url = (page, letter) =>
  `https://samehadaku.vip/a-z/page/${page}/?letter=${letter}`;
const expression =
  '.+<div class="item"><a href="(https?://.+)" class="thumb"> <img src="(.+quality=[0-9]+&resize=[0-9,]+).+"entry-title" itemprop="headline">(.+)</h2></a><p>.+';
const letterList = ['0-9', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

module.exports = async () => {
  let results = [], i = 0;

  for (var letter of letterList) {
    i++;
    console.log(`A - ${i}/${letterList.length}`)
    try {
      let response = await axios.get(main_url + letter);
      let { data } = response;
      if (data.indexOf('<article id="post-') > -1) {
        results = [
          ...results,
          ...data
            .replace(/[\n\t]/g, '')
            .split('<div class="widget az-list">')[1]
            .split('</article></div></div>')[0]
            .split('</article>')
            .filter((x) => !!x)
            .map((x) => ({
              url: x.replace(new RegExp(expression, 'gi'), '$1'),
              thumb: x.replace(new RegExp(expression, 'gi'), '$2'),
              title: x.replace(new RegExp(expression, 'gi'), '$3'),
            })),
        ];
        if (data.indexOf('<div class="pagination">') != -1) {
          let [current, length] = data
            .replace(/[\n\t]/g, '')
            .split('<div class="pagination"><span>Page ')[1]
            .split('</span>')[0]
            .split(' of ')
            .map((x) => Math.floor(Number(x) + 1));
          for (let i = current; i < length; i++) {
            let _response = await axios.get(pagination_url(current, letter));

            if (data.indexOf('<article id="post-') > -1)
              results = [
                ...results,
                ..._response.data
                  .replace(/[\n\t]/g, '')
                  .split('<div class="widget az-list">')[1]
                  .split('</article></div></div>')[0]
                  .split('</article>')
                  .filter((x) => !!x)
                  .map((x) => ({
                    url: x.replace(new RegExp(expression, 'gi'), '$1'),
                    thumb: x.replace(new RegExp(expression, 'gi'), '$2'),
                    title: x.replace(new RegExp(expression, 'gi'), '$3'),
                  })),
              ];
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  return results;
};
