import logger from '../logger';
import eventBus from '../events';
import {EVENT_MESSAGE} from '../events';
import _ from 'lodash';
import TelegramBot from 'node-telegram-bot-api';
import util from 'util';

export default class TelegramProvider {
    constructor(config = {}) {
        const required = ['token'];
        this.config = _.extend({}, config);
        required.forEach((field) => {
            if (this.config[field] == undefined){
                throw new Error(`field "${field}" must be specified`);
            }
        });
        this.bot = new TelegramBot(this.config.token, {
            polling: true
        });
        this.bot.on('error', (err) => {
            logger.error(err.message);
            this.bot.stopPolling();
        });
    }

    start() {
        this.bot.on('message', (msg) => {
            const chatId = msg.chat.id;
            eventBus.emit(EVENT_MESSAGE, msg.text, chatId, this);
        });
    }

    reply(to, text) {
        this.bot.sendMessage(to, text, {
            //parse_mode: 'markdown',
            disable_web_page_preview: true
        });
    }


}