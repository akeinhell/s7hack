import eventBus, {EVENT_MESSAGE} from './events';

import logger from './logger';
import qs from 'querystring';
import {getState, INIT_STATE} from './state';


class S7bot {
    constructor() {
        this.providers = [];
    }

    use(provider) {
        this.providers.push(provider);
    }

    response

    run() {
        eventBus.on(EVENT_MESSAGE, (message, chat, provider) => {
            getState(provider.constructor.name, chat)
              .then(state => {
                  logger.info('EVENT_MESSAGE state', state);
                  switch (state.state) {
                      case INIT_STATE:
                          provider.reply(chat, 'HELLO MAZAFACA');
                          break;
                  }
              });
        });

        this.providers.forEach((provider) => {
            logger.info(`starting ${provider.constructor.name}`);
            provider.start();
        });

    }

}

export default new S7bot();