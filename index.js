const {
  samehadaku: { getAnimeList, getEpisodesList, getDownloadUrl },
  anime: { search },
  send,
  zippy: { upload },
} = require('./lib');

const fs = require('fs');
const tes2 = async () => {
  const res = require('./res.json');
  let _res = res.results,
    temp;
  for (var i = 0; i < _res.length; i++) {
    for (var j = 0; j < _res[i].results.length; j++) {
      let url =
        _res[i].results[j].url.indexOf('<') == -1
          ? _res[i].results[j].url
          : false;

      temp = url ? await getDownloadUrl(url) : { ok: false };
      if (temp.ok) {
        console.log('OK', _res[i].results[j].url);
        _res[i].results[j] = {
          ..._res[i].results[j],
          download: temp.results,
        };
      } else {
        console.log('NOT OK', _res[i].results[j].url);
        _res[i].results[j] = {
          ..._res[i].results[j],
          download: [],
        };
      }
    }
  }

  require('fs').writeFileSync('./res2.json', JSON.stringify(_res, null, 4));
  return;
};

const tes1 = async () => {
  let links = await getAnimeList(),
    results = [],
    bad = [],
    i = 0;

  for (let link of links) {
    i++;
    console.log(`B - ${i}/${links.length}`);
    try {
      let mal = await search(link.title);
      let eps = await getEpisodesList(link.url);
      if (eps.ok) {
        results.push({
          ...mal,
          ...eps,
        });
      } else {
        bad.push(link);
      }
    } catch (e) {
      console.log(e);
      console.log(link);

      bad.push(link);
    }
  }

  require('fs').writeFileSync(
    './res.json',
    JSON.stringify({
      results,
      bad,
    })
  );

  return;
};

(async() => {
  await tes1();
  await tes2();
  let uri = await upload('res2.json', fs.readFileSync('./res2.json'));
  await send(JSON.stringify(uri, null, 4));
})();
