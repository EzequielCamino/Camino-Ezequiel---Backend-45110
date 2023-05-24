const MongoService = require("./mongo.service.js");
const ticketModel = require("./models/ticket.model.js");

class TicketService {
  #persistence;
  constructor(persistence) {
    this.#persistence = persistence;
  }
  create(ticket) {
    return this.#persistence.create(ticket);
  }
}
const instance = new TicketService(new MongoService(ticketModel));

module.exports = instance;