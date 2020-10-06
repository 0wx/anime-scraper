const _month = {
  januari: '01',
  februari: '02',
  maret: '03',
  april: '04',
  mei: '05',
  juni: '06',
  juli: '07',
  agustus: '08',
  september: '09',
  oktober: '10',
  november: '11',
  desember: '12',
};
module.exports = (format, time) => {
  // Format = 7 april 2019
  // Time = 17:19
  let dateString =
      format
        .split(' ')
        .map((x) =>
          !Number(x)
            ? _month[x.toLowerCase()] || '01'
            : x.length < 2
            ? '0' + x
            : x
        )
        .join('/') + ` - ${time || '00:00'}`,
    dateArgs = dateString.match(/\d{2,4}/g),
    year = dateArgs[2],
    month = parseInt(dateArgs[1]) - 1,
    day = dateArgs[0],
    hour = dateArgs[3],
    minutes = dateArgs[4];

  return new Date(year, month, day, hour, minutes).getTime();
};
