import S7Bot from './bot';
import TelegramProvider from './bot/providers/telegram-provider';
import dotenv from 'dotenv';
import './srv';
import Searcher from './bot/search';
import VkProvider from './bot/providers/vk-provider';
import eventBus, {EVENT_MESSAGE} from './bot/events';

dotenv.config();
let telegramProvider = new TelegramProvider({
    token: process.env.TELEGRAM_TOKEN
})

S7Bot.use(telegramProvider);
S7Bot.use(new VkProvider({
    token: process.env.VK_TOKEN
}));

Searcher.init();

S7Bot.run();

setTimeout(() => {
    eventBus.emit(EVENT_MESSAGE, 'Из питера в москву', 94986676, telegramProvider);
}, 5000);