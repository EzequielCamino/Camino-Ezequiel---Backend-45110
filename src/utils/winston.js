const winston = require('winston');
const config = require('../config/config.js');

const levels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    http: 4,
    debug: 5
}
const colors = {
    fatal: 'red',
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'blue',
    debug: 'white'
}

const logger = winston.createLogger({
    levels: levels,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    timestamp: true,
    transports: [
        new winston.transports.Console({
            level: (config.ENVIRONMENT === "production") ? 'info' : 'debug',
            format: winston.format.combine(
                winston.format.colorize({colors: colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './src/logs/errors.log',
            level: 'error',
            format: winston.format.simple()
        })
    ]
})

module.exports = logger;