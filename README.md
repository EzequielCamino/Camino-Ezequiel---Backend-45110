# Camino Ezequiel - Backend-45110

## Dependencies
- Express
- Express-handlebars
- Mongoose
- Mongoose-paginate-v2
- Multer
- Socket.io
- Sweetalert2
- Connect-mongo
- Session-file-store
- Bcrypt
- Cookie-parser
- Jsonwebtoken
- Passport
- Passport-local
- Passport-github2
- Passport-jwt
- Dotenv
- Commander
- Nodemailer
- Twilio (not in use)
- Winston

### Dev Dependencies
- Nodemon
- Mocha
- Chai
- Supertest

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install this project.

```bash
npm install
```

## Initialization

```bash
npm start
```
To start with FS persistence(not working properly)(DEFAULT IS MONGO):
```bash
npm start -- --mode=fs
```
To start on production environment(DEFAULT IS DEVELOPMENT):
```bash
npm start -- --env=production
```

## Usage

All endpoints and their respective routes/bodies can be find here:

[Postman Workspace](https://www.postman.com/ezequielcamino/workspace/camino-ezequiel-backend-45110)

#### For your convenience, products collection can be found at root as "products.json" so you can import it to MongoDB.

## Views

- API Documentation: [http://localhost:8080/apidocs](http://localhost:8080/apidocs)
- Products without pagination and querys: [http://localhost:8080/](http://localhost:8080/)
- RealTimeProducts (with socket connection): [http://localhost:8080/realtimeproducts](http://localhost:8080/realtimeproducts)
- Products with pagination and querys (has to be logged in): [http://localhost:8080/products](http://localhost:8080/products)
- Carts (has to be selected by ID): [http://localhost:8080/carts/:cid](http://localhost:8080/carts/:cid)
- Register (not accesible if logged in): [http://localhost:8080/api/sessions/register](http://localhost:8080/api/sessions/register)
- Login (not accesible if logged in): [http://localhost:8080/api/sessions/login](http://localhost:8080/api/sessions/login)
- Profile (has to be logged in): [http://localhost:8080/api/sessions/profile](http://localhost:8080/api/sessions/profile)
- Current (looks for JWT token): [http://localhost:8080/api/sessions/current](http://localhost:8080/api/sessions/current)
- Dashboard (only Admin can access): [http://localhost:8080/api/sessions/dashboard](http://localhost:8080/api/sessions/dashboard)
- Cart (has to be logged in): [http://localhost:8080/api/carts/checkout](http://localhost:8080/api/carts/checkout)
- Restore password (needs a unique JWT): [http://localhost:8080/api/sessions/recover/:token](http://localhost:8080/api/sessions/recover/:token)

#### Other views:
- Chat with socket (only accesible as an User): [http://localhost:8080/chat](http://localhost:8080/chat)
- Cookie test: [http://localhost:8080/cookies](http://localhost:8080/cookies)
- Logger Test: [http://localhost:8080/api/loggerTest](http://localhost:8080/api/loggerTest)

## Notes

- To Login as an admin use the following credentials:
`Username: adminCoder@coder.com`
`Password: adminCod3r123` 

- On endpoint 'http://localhost:8080/api/sessions/premium/:id' documents must start with the following names in order to validate correctly:
'profile'
'address'
'identification'
'status'
