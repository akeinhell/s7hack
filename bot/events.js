import {EventEmitter} from 'events';

class BotEmitter extends EventEmitter {};

export const EVENT_MESSAGE = 'message';
export const EVENT_RESPONSE = 'response';

export default new BotEmitter();