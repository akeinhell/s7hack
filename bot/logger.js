import winston from 'winston';

const tsFormat = () => (new Date()).toLocaleTimeString();

const logDir = './logs';


const consoleParams = {
    colorize: true,
    prettyPrint: true,
    silent: false,
    timestamp: tsFormat,
};
const options = {
    transports: [
        new (winston.transports.Console)(consoleParams),
        new (winston.transports.File)({ filename: `${logDir}/runtime.log`})
    ],
    exceptionHandlers: [
        new winston.transports.File({
            filename: `${logDir}/exceptions.log`,
            timestamp: tsFormat,
        }),
        new (winston.transports.Console)(consoleParams),
    ]
};
export default new winston.Logger(options);