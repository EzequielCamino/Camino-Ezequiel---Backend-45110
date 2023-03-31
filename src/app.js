const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { PORT, MONGO_URL } = require("../data.js") 
const handlebars = require('express-handlebars');
const productsRoute = require('./routes/products.route.js')
const cartsRoute = require('./routes/carts.route.js')
const viewsRoute = require("./routes/views.route.js")
const configureSocket = require("./socket/configure-socket.js");
const cookieParser = require("cookie-parser");

/* MONGOOSE */
mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

/* HANDLEBARS */
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');


/* MIDDLEWARES */
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

/* ROUTES */
app.use('/', viewsRoute);
app.use('/api/products', productsRoute);
app.use('/api/carts', cartsRoute);

/* WEBSOCKET & LISTEN */
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor levantado en el puerto ${PORT}`);
});
configureSocket(httpServer);
const socketServer = configureSocket().getSocketServer();
socketServer.on('connection', (socket) => {
    console.log('Socket conectado')
})
