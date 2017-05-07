import winston from 'winston';

const tsFormat = () => (new Date()).toLocaleTimeString();

const logDir = './logs';

const options = {
    transports: [
        new (winston.transports.Console)({
            colorize: true,
            timestamp: tsFormat,
        }),
        new (winston.transports.File)({ filename: `${logDir}/runtime.log`})
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: `${logDir}/exceptions.log`}),
        new (winston.transports.Console)(),
    ]
};
export default new winston.Logger(options);