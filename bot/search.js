import  elasticsearch from 'elasticsearch';
import  fs from 'fs';
import  readline from 'readline';
import  logger from './logger';
import dotenv from "dotenv";
import  util from 'util';

dotenv.config();

let client = new elasticsearch.Client({
    host: process.env.ELASTIC_URL,
    requestTimeout: 20000,
    log: 'trace'
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
        /*client.indices.create({
         index: 's7'
         },function(err,resp,status) {
         if(err) {
         console.log(err);
         }
         else {
         console.log("create",resp, status);
         }
         });

         return;*/

        let inputFile = 'airport.csv';

        let lineReader = readline.createInterface({
            input: fs.createReadStream(inputFile)
        });
        let headers = [];
        let indexArray = [];

        lineReader.on('line', (line) => {
            let lines = line.split('\t');
            if (headers.length === 0) {
                headers = [].concat(lines);
                return;
            }

            let body = {};
            lines.forEach((el, index) => {
                const key = headers[index];
                body[key] = el;
            });
            indexArray.push({
                index: {
                    _index: 's7',
                    _type: 'airport',
                    _id: body.iata_code,
                    body
                }
            });
        });

        lineReader.on('close', () => {
            client.bulk({body: indexArray})
                .then(d => logger.info('done', d))
                .catch(e => logger.error(e));
        });


    }
}

let searcher = new Searcher();

export default searcher;