import logger from '../logger';
import eventBus, {EVENT_VK_MESSAGE} from '../events';
import {EVENT_MESSAGE} from '../events';
import VKApi from 'node-vkapi';

export default class VkProvider {
    constructor(config = {}) {
        this.token = config.token;
        this.vk = new VKApi({
            token: config.token
        });
    }

    start() {
        eventBus.on(EVENT_VK_MESSAGE, data => {
            let chatId = data.user_id;
            let text = data.body;
            eventBus.emit(EVENT_MESSAGE, text, chatId, this);
        });
    }

    reply(to, text) {
       logger.info(`response [${to}]: ${text}`);
        this.vk.call('messages.send', {
            user_id: to,
            message: text
        })
          .then(r => logger.info(r))
          .catch(e => logger.error(e))
        ;
    }
}