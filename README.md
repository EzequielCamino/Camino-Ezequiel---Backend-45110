# Camino Ezequiel - Backend-45110

## Dependecies
- Express
- Express-handlebars
- Mongoose
- Mongoose-paginate-v2
- Multer
- Socket.io
- Sweetalert2
- Connect-mongo
- Session-file-store
- Bcrypt _(not needed at this point)_
- Cookie-parser _(not needed at this point)_

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install this project.

```bash
npm install
```

## Initialization

```bash
npm start
```

## Usage

All endpoints and their respective routes/bodies can be find here:

[Postman Workspace](https://www.postman.com/ezequielcamino/workspace/camino-ezequiel-backend-45110)

## Environment variables

```bash
const data = {
    PORT: 8080,
    MONGO_URL: 'mongodb://127.0.0.1:27017/ecommerce'
};
```
#### For your convenience, products collection can be found at root as "products.json" so you can import it to MongoDB.
#### Also you can find "data.js" with environment variables ready to use.

## Views

- Products without pagination and querys: [http://localhost:8080/](http://localhost:8080/)
- RealTimeProducts (with socket connection): [http://localhost:8080/realtimeproducts](http://localhost:8080/realtimeproducts)
- Products with pagination and querys: [http://localhost:8080/products](http://localhost:8080/products)
- Carts (has to be selected by ID): [http://localhost:8080/carts/:cid](http://localhost:8080/carts/:cid)
- Register (not accesable if logged in): [http://localhost:8080/api/sessions/register](http://localhost:8080/api/sessions/register)
- Login (not accesable if logged in): [http://localhost:8080/api/sessions/login](http://localhost:8080/api/sessions/login)
- Profile (has to be logged in): [http://localhost:8080/api/sessions/profile](http://localhost:8080/api/sessions/profile)

#### Other views:
- Chat with socket: [http://localhost:8080/chat](http://localhost:8080/chat)
- Cookie test: [http://localhost:8080/cookies](http://localhost:8080/cookies)

## Notes

- On endpoint [http://localhost:8080/products](http://localhost:8080/products) the button "Add product to cart" doesn't work properly, it only shows the product ID in console ("Create cart" endpoint fetch commented)
