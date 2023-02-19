
const express = require("express");
const ProductManager = require("./main.js");
const app = express();

const productManager = new ProductManager("./products.json");

app.listen(8080, () => {
    console.log("Servidor levantado en el puerto 8080");
});

app.get("/", (req,res) => {
    res.send({info: "/products => para ver los productos"})
})

app.get("/products", async (req, res) => {
    const products = await productManager.getProducts();
    const limit = req.query.limit
    if(limit) {
        res.send(products.slice(0,limit));
    } else {
        res.send({ products });
    }
});

app.get("/products/:pid", async (req, res) => {
    const products = await productManager.getProducts();
    const pid = products.find((product) => product.id === Number(req.params.pid));
    if (pid) {
        res.send(pid);
    } else {
        res.send({error: "Product ID not found"})
    }
});
