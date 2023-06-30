const express = require("express");
const config = require("./config/config.js")
const app = express();
const mongoose = require("mongoose");
const handlebars = require('express-handlebars');
const productsRoute = require('./routers/products.route.js');
const cartsRoute = require('./routers/carts.route.js');
const viewsRoute = require("./routers/views.route.js");
const cookiesRoute = require("./routers/cookies.route.js");
const usersRoute = require('./routers/user.router.js');
const configureSocket = require("./config/configure-socket.js");
const cookieParser = require("cookie-parser");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const initializePassport = require('./config/passport-config.js');
const errorHandler = require("./middlewares/error.js");
const logMiddleware = require('./middlewares/logger.js');
const loggerRoute = require('./routers/logger.route.js');
const spec = require('./docs/swagger-options.js');
const swaggerUiExpress = require('swagger-ui-express');

/* MONGOOSE */
if(config.PERSISTENCE !== "fs"){
    mongoose.connect(config.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }); 
}

/* MIDDLEWARES */
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(spec));
app.use(cookieParser())
app.use(session({
    store: MongoStore.create({
        mongoUrl: config.MONGO_URL,
        mongoOptions:{useNewUrlParser: true, useUnifiedTopology: true},
        ttl: 15
    }),
    secret: config.COOKIESECRET,
    resave: true,
    saveUninitialized: true
}))
initializePassport();
app.use(passport.initialize());
app.use(passport.session())
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);
app.use(logMiddleware);

/* HANDLEBARS */
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');

/* ROUTES */
app.use('/', viewsRoute);
app.use('/api', loggerRoute);
app.use('/api/products', productsRoute);
app.use('/api/carts', cartsRoute);
app.use('/api/sessions', usersRoute);
app.use('/api/cookies', cookiesRoute);

/* WEBSOCKET & LISTEN */
const httpServer = app.listen(config.PORT, () => {
    console.log(`Server listening on port ${config.PORT}`, "\n", `Using ${config.PERSISTENCE} persistence model`, "\n", `Server running on ${config.ENVIRONMENT} environment`);
});
configureSocket(httpServer);
const socketServer = configureSocket().getSocketServer();
socketServer.on('connection', (socket) => {
    console.log('Socket conectado')
})