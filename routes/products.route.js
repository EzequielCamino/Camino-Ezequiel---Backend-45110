const { Router } = require("express");
const fs = require('fs');
const route = Router();
const ProductManager = require("../ProductManager.js");
const productManager = new ProductManager("./products.json");
const uploader = require("../utils");
const path = require('path');

function validateProduct(product) {
    const validateKeys = ['title', 'description', 'code', 'price', 'status', 'stock', 'category'];
    const productKeys = Object.keys(product);
    return (
        validateKeys.every((key) => productKeys.includes(key)) &&
        productKeys.every((key) => validateKeys.includes(key))
      );
}

function deleteFiles(files){
    files.forEach(element => {            
        const filePath = element.filename;
        fs.unlinkSync(path.join(__dirname, "..", '/public/img', filePath));
    });
}

route.get("/", async (req, res) => {
    const limit = req.query.limit
    const products = await productManager.getProducts();
    if(limit) {
        res.send(products.slice(0,limit));
    } else {
        res.send({ products });
    }
});

route.get("/:pid", async (req, res) => {
    const id = req.params.pid
    const products = await productManager.getProducts();
    const pid = products.find((product) => product.id === Number(id));
    if (pid) {
        res.send(pid);
    } else {
        res.send({error: "Product ID not found"})
    }
});

route.post("", uploader.array('thumbnails'), async (req, res) => {
    if(!req.body.status){
        req.body.status = true;
    }
    const productBody = req.body;
    const productFiles = req.files;
    const validate = validateProduct(productBody)
    if(!validate){
        deleteFiles(req.files);
        console.log('files were deleted');
        res.status(400).send({error: 'Invalid data'});
        return
    }
    const product = {title: productBody.title, description: productBody.description, code: productBody.code, price: Number(productBody.price), status: Boolean(productBody.status), stock: Number(productBody.stock), category: productBody.category, thumbnails: productFiles}
    const response = await productManager.addProduct(product)
    if(!response){
        deleteFiles(req.files)
        res.status(400).send({error: 'Code assigned'})
        return
    }
    res.status(201).send({AssignedID: response})
})

route.put("/:pid", async (req, res) => {
    const id = Number(req.params.pid);
    const data= req.body;
    console.log(data);
    const response = await productManager.updateProduct(id, data);
    response ?
    res.status(201).send({ModificatedProductID: response})
    :res.status(400).send({error: 'Product not updated. ID not found'})
})

route.delete("/:pid", async (req, res) =>{
    const pid = Number(req.params.pid);
    const response = await productManager.deleteProduct(pid);
    response ?
    res.status(201).send({DeletedProductID: response})
    :res.status(400).send({error: 'Product not deleted. ID not found'})
})

module.exports = route;