const axios = require('axios');

const info = async (id) => {
  let link = `https://myanimelist.net/includes/ajax.inc.php?t=64&id=${id}`;
  let { data } = await axios.get(link);
  const [
    x,
    nameAndLink,
    description,
    genre,
    status,
    type,
    episodes,
    score,
    rank,
    popularity,
    members,
  ] = data.split('\n');

  return {
    id,
    name: nameAndLink.split('>')[1].split('<')[0],
    url: nameAndLink.split('"')[1],
    description: description.split('>')[1].split('<')[0],
    genre: genre.split('</span> ')[1].split('<br />')[0].split(', '),
    status: status.split('</span> ')[1].split('<br />')[0],
    type: type.split('</span> ')[1].split('<br />')[0],
    episodes: Number(episodes.split('</span> ')[1].split('<br />')[0]) || '-',
    score: Number(score.split('</span> ')[1].split(' <small>')[0]) || '-',
    scoredByUser:
      Number(
        score.split('scored by ')[1].split(' users')[0].replace(/,/g, '')
      ) || '-',
    ranked: Number(
      rank.split('</span> #')[1].split('<br />')[0].replace(/,/g, '')
    ),
    popularity:
      Number(
        popularity.split('</span> #')[1].split('<br />')[0].replace(/,/g, '')
      ) || '-',
    members:
      Number(
        members.split('</span> ')[1].split('<br />')[0].replace(/,/g, '')
      ) || '-',
  };
};
const search = async (query, _type) => {
  let type = _type || 'anime';
  let { data } = await axios.get(
    `https://myanimelist.net/search/prefix.json?type=${type}&keyword=${query}&v=1`
  );

  return data.categories.map((x) =>
    x.items.filter(({ es_score }) => es_score > 1)
  )[0][0];
};


module.exports = {
  search,
  info,
};
