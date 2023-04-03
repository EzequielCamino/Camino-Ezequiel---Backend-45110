const { Router } = require("express");
const fs = require('fs');
const route = Router();
const productManager = require("../dao/product.manager.js")
const productsModel = require("../dao/models/product.model.js");
const uploader = require("../utils");
const path = require('path');
const configureSocket = require("../socket/configure-socket.js");

function deleteFiles(files){
    files.forEach(element => {            
        fs.unlinkSync(path.join(__dirname, "..", '/public/img', element));
    });
}

route.get("/", async (req, res) => {
    try {
        const query = req.query;
        const page = query.page ?? 1
        const products = await productsModel.paginate(
            {},
            { 
            page: page,
            limit: query.limit ?? 10,
            lean: true,
            sort: (query.sort === "asc" || query.sort === "desc") ? {price: query.sort} : 0,
            }
        );
        const badPagination = query.page && (isNaN(query.page) || products.page > products.totalPages || query.page < 1)
        badPagination ? res.status(400).send({status: "error"})
        : res.status(200).send({
            status: "success",
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `http://localhost:8080/products?page=${page-1}` : null,
            nextLink: products.hasNextPage ? `http://localhost:8080/products?page=${page+1}` : null
        });
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
});

route.get("/:pid", async (req, res) => {
    const id = req.params.pid;
    try {
        const product = await productManager.findById(id);
        if (!product) {
            res.status(404).send({error: "Product ID not found"});
            return;
        }
        res.status(200).send({product});
    } catch (error) {
        res.status(404).send({error: "Product ID not found"});
    }
});

route.post("/", uploader.array('thumbnails'), async (req, res) => {
    try {
        const product = req.body;
        const files = req.files;
        product.thumbnails = await files.map(f=> f.originalname)
        const newProduct = await productManager.create(product);
        configureSocket().getSocketServer().emit('productsModified');
        res.status(201).send({id: newProduct._id});
    } catch (error) {
        deleteFiles(req.files);
        res.status(400).send({error: "Invalid product format or assigned code"})
    }
})

route.put("/:pid", async (req, res) => {
    try {
        const id = req.params.pid;
        const data= req.body;
        await productManager.findByIdAndUpdate(id, data);
        configureSocket().getSocketServer().emit('productsModified');
        res.status(201).send({ModificatedProductID: id})
    } catch (error) {
        console.log(error);
        res.status(404).send({error: 'Product not updated. ID not found'})
    }
})

route.delete("/:pid", async (req, res) =>{
    try {
        const pid = req.params.pid;
        const imgExists = await productManager.findById(pid);
        if(imgExists.thumbnails){
            deleteFiles(imgExists.thumbnails)
        }            
        await productManager.findByIdAndDelete(pid);
        configureSocket().getSocketServer().emit('productsModified');
        return res.status(201).send({DeletedProductID: pid})
    } catch (error) {
        console.log(error);
        res.status(404).send({error: 'Product not deleted. ID not found'});
    }
})

module.exports = route;