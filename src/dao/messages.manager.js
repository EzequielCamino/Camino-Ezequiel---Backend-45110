const MongoManager = require("./mongo.manager.js");
const messagesModel = require("./models/chat/messages.model.js");

class MessagesManager {
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
const instance = new MessagesManager(new MongoManager(messagesModel));

module.exports = instance;