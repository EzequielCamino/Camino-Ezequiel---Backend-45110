const twilio = require('twilio');
const config = require('../config/config.js');

const client = twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);

client.messages.create({
    from: config.TWILIO_SMS_NUMBER,
    to: config.MY_NUMBER,
    body: 'Mensaje desde Twilio'
})
.then((result) => console.log("message sent", result))
.catch((error) => console.log(error));