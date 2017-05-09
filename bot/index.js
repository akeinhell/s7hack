import {EVENT_MESSAGE} from "./events";
import eventBus from './events';
import util from 'util';
import Searcher from './search';
import logger from './logger';
import qs from 'querystring';

const getUrl = (from, to) => {
    console.log('from', from);
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
        trip_class:0
    };
    return `https://search.aviasales.ru/?` + qs.stringify(params);
}

class S7bot {
    constructor() {
        this.providers = [];
    }
    use(provider) {
        this.providers.push(provider);
    }

    run() {
        eventBus.on(EVENT_MESSAGE, (message, chat, provider) => {
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
                                    }
                                });
                            if (airports.length == 2){
                                let [from, dest] = airports;
                                let url = getUrl(from, dest);
                                let msg = `Найден маршрут из ${from.text} в ${dest.text}. Подробности ${url}`;
                                logger.info('response: '+msg);
                                provider.reply(chat, msg);
                            } else {
                                let tplString = 'Из *Города* В *Город*';
                                provider.reply(chat, `не удалось найти маршрут. Пример запроса "${tplString}"`);
                            }
                        })
                        .catch(e => logger.error(e))
                    ;
                });
        });

        this.providers.forEach((provider) => {
            logger.info(`starting ${provider.constructor.name}`);
            provider.start();
        });

    }

}

export default new S7bot();