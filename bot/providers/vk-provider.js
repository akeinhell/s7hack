import logger from '../logger';
import eventBus, {EVENT_VK_MESSAGE} from '../events';
import {EVENT_MESSAGE} from '../events';
import _ from 'lodash';
import TelegramBot from 'node-telegram-bot-api';
import util from 'util';

export default class VkProvider {
    constructor(config = {}) {

    }

    start() {
        eventBus.on(EVENT_VK_MESSAGE, data => {
            let chatId = data.user_id;
            let text = data.body;
            eventBus.emit(EVENT_MESSAGE, text, chatId, this);
        });
    }

    reply(to, text) {
       logger.info(to, text);
    }
}