const dotenv = require('dotenv');
const { Command } = require('commander');

const program = new Command();
program.option("-m, --mode <mode>", "Persistence", "mongo");
program.parse();

const mode = program.opts().mode;

dotenv.config()

const config = {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    COOKIESECRET: process.env.COOKIESECRET,
    githubClientID: process.env.githubClientID,
    githubClientSecret: process.env.githubClientSecret,
    githubCallbackURL: process.env.githubCallbackURL,
    JWT_TOKEN: process.env.JWT_TOKEN,
    SESSION_SECRET: process.env.SESSION_SECRET,
    NODEMAILER_PASSWORD: process.env.NODEMAILER_PASSWORD,
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_SMS_NUMBER: process.env.TWILIO_SMS_NUMBER,
    MY_NUMBER: process.env.MY_NUMBER,
    PERSISTENCE: mode,
}

module.exports = config;