// const { data }  = require('./res2.json');

// let res = [];
// data.map(x => x.results).forEach(e => {
//   e.forEach(c => res.push(c));

// });

// console.log(res.filter(x => x.date < 0))

const {
  samehadaku: { getEpisodesList },
} = require('./lib');

getEpisodesList('https://samehadaku.vip/naruto-shippuuden-episode-68-69/')
.then(console.log)