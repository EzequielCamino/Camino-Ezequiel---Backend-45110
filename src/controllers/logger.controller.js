const logger = require('../utils/winston.js');

const loggerTest = async (req, res) => {
    logger.debug('debug log');
    logger.http('http log');
    logger.info('info log');
    logger.warn('warn log');
    logger.error('error log');
    logger.fatal('fatal log');
    res.status(200).send('Logger test completed');
}

module.exports = {loggerTest}