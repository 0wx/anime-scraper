const {
  samehadaku: { getAnimeList, getEpisodesList },
  anime: { search, info },
} = require('./lib');

(async () => {
  let links = await getAnimeList(),
    results = [],
    bad = [],
    i = 0;

  for (let link of links) {
    i++;
    console.log(`B - ${i}/${links.length}`)
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
      bad
    })
  );
})();
