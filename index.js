import S7Bot from './bot';
import TelegramProvider from './bot/providers/telegram-provider';
import dotenv from 'dotenv';

dotenv.config();
S7Bot.use(new TelegramProvider({
    token: process.env.TELEGRAM_TOKEN
}));

//Searcher.init();


S7Bot.run();