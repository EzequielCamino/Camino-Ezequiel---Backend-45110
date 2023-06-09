const { Faker, es, en, base } = require("@faker-js/faker");

const faker = new Faker({
  locale: [es, en, base],
});

/**
 * @returns {Product}
 */
function generateProduct() {
  return {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    code: faker.string.alphanumeric(),
    price: faker.commerce.price(),
    status: faker.datatype.boolean(),
    stock: faker.number.int({ min: 1, max: 100 }),
    category: faker.commerce.department(),
    thumbnails: faker.image.url(),
  };
}

/**
 * @typedef {{
 * title: String;
 * description: String;
 * code: String;
 * price: Number;
 * status: Boolean;
 * stock: Number;
 * category: String;
 * thumbnails: String;
 * }} Product
 */

module.exports = generateProduct;