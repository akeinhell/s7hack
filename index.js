import S7Bot from './bot';
import TelegramProvider from './bot/providers/telegram-provider';
import dotenv from 'dotenv';
import app from './srv/app';
import './srv';
import Searcher from './bot/search';
import VkProvider from './bot/providers/vk-provider';

dotenv.config();
S7Bot.use(new TelegramProvider({
    token: process.env.TELEGRAM_TOKEN
}));
S7Bot.use(new VkProvider({
    token: process.env.VK_TOKEN
}));

Searcher.init();


// S7Bot.run();