import logger from '../logger';
import eventBus from '../events';
import {EVENT_MESSAGE} from '../events';
import _ from 'lodash';

export default class TelegramProvider {
    constructor(config = {}) {
        const required = ['token'];
        this.config = _.extend({
            //token: ''
        }, config);
        required.forEach((field) => {
            if (this.config[field] == undefined){
                throw new Error(`field "${field}" must be specified`);
            }
        });
    }

    start() {
        logger.info('start listen telegram', this.config);
        eventBus.emit(EVENT_MESSAGE, 'mmeeessage', 'from', this);
    }


}