import log from './logger';
import {EVENT_MESSAGE} from "./events";
import eventBus from './events';
import util from 'util';

class S7bot {
    constructor() {
        this.providers = [];
    }
    use(provider) {
        this.providers.push(provider);
    }

    run() {
        eventBus.on(EVENT_MESSAGE, (message, from, provider) => {
            log.info('new message', message);
            log.info(util.inspect(message));
            log.info(util.inspect(from));
            provider.reply(from, `Your message ${message}`);
        });

        this.providers.forEach((provider) => {
            log.info(`starting ${provider.constructor.name}`);
            provider.start();
        });

    }

}

export default new S7bot();