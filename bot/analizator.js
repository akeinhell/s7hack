import Searcher from './search';
import logger from './logger';
import Az from 'az';


Az.Morph.init('node_modules/az/dicts', (err, _Morph) => {
    if (err) {
        return logger.error('123123', err.message);
    }
    logger.info('done!');
});
async function detectCity(word) {
    return Promise.race([Searcher.find([word])]);
}

const isDirection = (text) => ['из', 'в', 'на'].indexOf(text.toLowerCase()) >= 0;

export const analizeCity = (text) => {
    text = text.split(',').join('');
    return new Promise((resolve, reject) => {
        Searcher.analize(text)
          .then(tokens => {
              return text.split(' ').reduce((prev, word) => {
                  let i = tokens.findIndex((w) => {
                      return word.indexOf(w) >= 0;
                  }, word);
                  let ret = null;
                  switch (true) {
                      case (!!tokens[i]):
                          ret = {
                              type: 'city',
                              data: tokens[i]
                          };
                          break;
                      case isDirection(word):
                          ret = {
                              type: 'direction',
                              data: word
                          };
                          break
                  }
                  return {
                      ...prev,
                      [word]: ret
                  };
              }, {});
          })
          .then(obj => resolve(obj))
          .catch(e => reject(e))
        ;
    });


};

const getUrl = (from, to) => {
    logger.info('from', from);
    let params = {
        origin: from.city_rus,
        origin_iata: from.iata_code,
        destination: to.city_rus,
        destination_iata: to.iata_code,
        depart_date: '2017-06-01',
        return_date: '2017-07-01',
        adults: 1,
        children: 0,
        infants: 0,
        trip_class: 0
    };
    return `https://search.aviasales.ru/?` + qs.stringify(params);
};


const old = () => {
    Searcher
      .analize(message)
      .then(tokens => {
          Searcher
            .find(tokens)
            .then(data => {
                const airports = data.filter((i) => i).slice(0, 2)
                  .map(a => {
                      return {
                          ...a,
                          text: `${a.city_rus}, ${a.country_rus}`
                      };
                  });
                if (airports.length === 2) {
                    let [from, dest] = airports;
                    let url = getUrl(from, dest);
                    let msg = `Найден маршрут из ${from.text} в ${dest.text}. Подробности ${url}`;
                    logger.info('response: ' + msg);
                    provider.reply(chat, msg);
                } else {
                    let tplString = 'Из *Города* В *Город*';
                    provider.reply(chat, `не удалось найти маршрут. Пример запроса "${tplString}"`);
                }
            })
            .catch(e => logger.error(e))
          ;
      });
};