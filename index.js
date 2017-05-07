import S7Bot from './bot';
import log from './bot/logger';
import TelegramProvider from './bot/providers/telegram-provider';

log.debug('starting Bot');

S7Bot.use(new TelegramProvider({token:'hello'}));
S7Bot.run();