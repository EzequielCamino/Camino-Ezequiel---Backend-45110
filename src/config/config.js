const dotenv = require('dotenv');
dotenv.config()

const config = {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    COOKIESECRET: process.env.COOKIESECRET,
    githubClientID: process.env.githubClientID,
    githubClientSecret: process.env.githubClientSecret,
    githubCallbackURL: process.env.githubCallbackURL,
    JWT_TOKEN: process.env.JWT_TOKEN,
    SESSION_SECRET: process.env.SESSION_SECRET
}

module.exports = config;