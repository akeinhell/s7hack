import dotenv from 'dotenv';
import redisClient from 'redis';
import bluebird from 'bluebird';
import logger from './logger';

export const INIT_STATE = 'START';

dotenv.config();
bluebird.promisifyAll(redisClient.RedisClient.prototype);
bluebird.promisifyAll(redisClient.Multi.prototype);


let redis = redisClient.createClient({
    password: process.env.REDIS_PASS
});

const getKey = (p, c) => {
    return `S7:${p}:${c}`
}

export const saveState = (provider, chat, state) =>  {
    let key = getKey(provider, chat);
    redis.set(key, JSON.stringify(state));
    redis.expire(key, 60*60*3);
}

function getState(provider, chat) {

    return redis
      .getAsync(getKey(provider, chat))
      .then(state => {
          try{
              return JSON.parse(state);
          }catch (e) {
              return null;
          }
      })
      .then(state => {
          if (!state) {

              state = {
                  state: INIT_STATE,
                  data: {}
              };
              saveState(provider, chat, state);
          }
          return state;
      });
}
export {
    getState
};
redis.on('error', function (err) {
    logger.error('RedisError ' + err);
});