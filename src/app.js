const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { PORT, MONGO_URL, COOKIESECRET, SESSION_SECRET } = require("../data.js");
const handlebars = require('express-handlebars');
const productsRoute = require('./routes/products.route.js');
const cartsRoute = require('./routes/carts.route.js');
const viewsRoute = require("./routes/views.route.js");
const cookiesRoute = require("./routes/cookies.route.js");
const usersRoute = require('./routes/users.router.js');
const configureSocket = require("./socket/configure-socket.js");
const cookieParser = require("cookie-parser");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const initializePassport = require('./utils/passport-config.js');

/* MONGOOSE */
mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

/* MIDDLEWARES */
app.use(cookieParser())
app.use(session({
    store: MongoStore.create({
        mongoUrl: MONGO_URL,
        mongoOptions:{useNewUrlParser: true, useUnifiedTopology: true},
        ttl: 15
    }),
    secret: COOKIESECRET,
    resave: true,
    saveUninitialized: true
}))
initializePassport();
app.use(passport.initialize());
app.use(passport.session())
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* HANDLEBARS */
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');

/* ROUTES */
app.use('/', viewsRoute);
app.use('/api/products', productsRoute);
app.use('/api/carts', cartsRoute);
app.use('/api/sessions', usersRoute);
app.use('/api/cookies', cookiesRoute);

/* WEBSOCKET & LISTEN */
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor levantado en el puerto ${PORT}`);
});
configureSocket(httpServer);
const socketServer = configureSocket().getSocketServer();
socketServer.on('connection', (socket) => {
    console.log('Socket conectado')
})
