import eventBus, {EVENT_MESSAGE} from './events';

import logger from './logger';
import util from 'util';
import {getState, INIT_STATE} from './state';
import {analizeCity} from './analizator';


class S7bot {
    constructor() {
        this.providers = [];
    }

    use(provider) {
        this.providers.push(provider);
    }


    run() {
        eventBus.on(EVENT_MESSAGE, (message, chat, provider) => {
            getState(provider.constructor.name, chat)
              .then(state => {
                  logger.info('EVENT_MESSAGE state', state);
                  switch (state.state) {
                      case INIT_STATE:
                          // provider.reply(chat, 'приветствую, Куда хочешь ебануть?');
                          break;
                  }

                  analizeCity(message)
                    .then(data => {
                        console.log(util.inspect(data, {depth: null, colors: false}));
                    })
                    .catch(e => logger.error(e));
              });
        });

        this.providers.forEach((provider) => {
            logger.info(`starting ${provider.constructor.name}`);
            provider.start();
        });

    }

}

export default new S7bot();