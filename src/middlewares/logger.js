const logger = require('../utils/winston.js');

const logMiddleware = (req, res, next) => {
    req.logger = logger;
    req.logger.http(`${req.method} in ${req.url}`);
    next();
}

module.exports = logMiddleware;