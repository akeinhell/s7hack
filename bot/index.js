import log from './logger';
import util from 'util';
import {EVENT_MESSAGE} from "./events";
import eventBus from './events';

class S7bot {
    constructor() {
        this.providers = [];
    }
    use(provider) {
        this.providers.push(provider);
    }

    run() {
        eventBus.on(EVENT_MESSAGE, (message, from, provider) => {
            log.info('new message', {
                message, from, provider
            });
        });

        this.providers.forEach((provider) => {
            setInterval(() => {
                provider.start();
            }, 1000);
        });

    }

}

export default new S7bot();