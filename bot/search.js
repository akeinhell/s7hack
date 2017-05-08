import  elasticsearch from 'elasticsearch';
import  logger from './logger';
import  util from 'util';


class Searcher {
    find(term) {

    }

    init() {
        let client = new elasticsearch.Client({
            host: process.env.ELASTIC_URL,
            //log: 'trace'
        });

        client.ping({requestTimeout: 1000})
            .then(() => {logger.info('Elastic connected')});
    }
}

let searcher = new Searcher();

export const find = () => {

}

export default searcher;