const MongoService = require("./mongo.service.js");
const messagesModel = require("./models/messages.model.js");

class MessagesService {
  #persistence;
  constructor(persistence) {
    this.#persistence = persistence;
  }
  getAll() {
    return this.#persistence.getAll();
  }
  create(chat) {
    return this.#persistence.create(chat);
  }
}
const instance = new MessagesService(new MongoService(messagesModel));

module.exports = instance;