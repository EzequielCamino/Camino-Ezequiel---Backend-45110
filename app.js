const express = require("express");
const app = express();
const port = 8080;
const productsRoute = require('./routes/products.route.js')
const cartsRoute = require('./routes/carts.route.js')

app.use(express.static(__dirname + 'public'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get("/", (req,res) => {
    res.send({info: "api/products => para ver los productos"})
});

app.use('/api/products', productsRoute);

app.use('/api/carts', cartsRoute);

app.listen(port, () => {
    console.log(`Servidor levantado en el puerto ${port}`);
});