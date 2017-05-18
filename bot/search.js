import elasticsearch from 'elasticsearch';
import fs from 'fs';
import readline from 'readline';
import logger from './logger';
import dotenv from 'dotenv';
import util from 'util';

dotenv.config();

let client = new elasticsearch.Client({
    host: process.env.ELASTIC_URL,
    requestTimeout: 20000,
    log: 'info'
});


class Searcher {
    analize(text) {
        logger.info(`start analys: ${text}`);
        return client.indices.analyze({
            analyzer: 'russian',
            text
        })
          .then(data => data.tokens.map(i => i.token))
          .catch(e => logger.error(e));
    }

    find(terms) {
        logger.info(`search: ${terms.join(', ')}`);
        let promises = terms.map(t => {
            logger.info(`add to search ${t}*`);
            return client.search({
                index: 's7',
                type: 'airport',
                body: {
                    size: 1,
                    query: {
                        query_string: {
                            fields: ['name_rus', 'city_rus^2', 'country_rus^3', 'tags^5'],
                            query: `${t}*`,
                            analyze_wildcard: true
                        }
                    }
                }
            })
              .then(data => {
                  return data.hits.hits.map(i => i._source).pop();
              });
        });
        return Promise.all(promises);
    }

    init() {
        client.indices.create({
            index: 's7'
        })
          .then(() => logger.info('index created'))
          .catch((e) => logger.error(`index create failed: ${e.message}`));


        let inputFile = 'airport.csv';

        let lineReader = readline.createInterface({
            input: fs.createReadStream(inputFile)
        });
        let headers = [];
        let indexArray = [];

        lineReader.on('line', (line) => {
            let lines = line.split('\t');
            if (headers.length === 0) {
                headers = [].concat(lines.map(l => {
                    return l.split('"').join('').trim();
                }));
                return;
            }

            let body = {};
            lines.forEach((el, index) => {
                const key = headers[index];
                body[key] = key === 'tags' ? el.trim().split(',') : el.split('"').join('').trim();
            });
            indexArray.push({
                index: {
                    _index: 's7',
                    _type: 'airport',
                    _id: body.iata_code,
                }
            });
            indexArray.push({...body});
        });

        lineReader.on('close', () => {
            client.bulk({body: indexArray})
              .then(d => logger.info('Init search done', util.inspect(d, {depth: 0, maxArrayLength: 5})))
              .catch(e => logger.error(e.message));
        });


    }
}

let searcher = new Searcher();

export default searcher;