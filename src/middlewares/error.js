const EErrors = require('../Errors/enums.js');

const errorHandler = (error, req, res, next) => {
    console.log(error.cause);
    switch(error.code){
        case EErrors.INVALID_TYPES_ERROR:
            res.status(400).send({status:"error", error:error.name});
            break;
        default:
            res.status(400).send({status:"error", error:"Unhandled error"});
    }
}

module.exports = errorHandler;