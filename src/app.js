const express = require("express");
const app = express();
const port = 8080;
const productsRoute = require('./routes/products.route.js')
const cartsRoute = require('./routes/carts.route.js')
const viewsRoute = require("./routes/views.route.js")
const handlebars = require('express-handlebars');


app.use(express.static(__dirname + '/public'));
console.log(__dirname)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');

app.use('/', viewsRoute);

app.use('/api/products', productsRoute);

app.use('/api/carts', cartsRoute);

app.listen(port, () => {
    console.log(`Servidor levantado en el puerto ${port}`);
});