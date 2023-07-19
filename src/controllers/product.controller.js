const fs = require('fs');
const path = require('path');
const uploader = require("../utils/multer.js");
const productsModel = require("../dao/services/mongo/models/product.model.js");
const configureSocket = require("../config/configure-socket.js");
const generateProduct = require('../utils/mock.js');
const CustomError = require('../Errors/CustomError.js');
const EErrors = require('../Errors/enums.js');
const { generateProductErrorInfo } = require('../Errors/info.js');
let ProductService
const config = require('../config/config.js');
if(config.PERSISTENCE === "fs") {
    ProductService = require("../dao/services/fs/product.fs.service.js");
} else {
    ProductService = require("../dao/services/mongo/product.service.js");
}
const logger = require('../utils/winston.js');

function deleteFiles(files){
    files.forEach(element => {            
        fs.unlinkSync(path.join(__dirname, "..", '/public/img/products', element));
    });
}

const upload = uploader.array('thumbnails');

const getAll = async (req, res) => {
    try {
        const { page, limit, sort, ...query } = req.query;
        const products = await productsModel.paginate(
            query,
            {page: page ?? 1,
            limit: limit ?? 10,
            lean: true,
            sort: (sort === "asc" || sort === "desc") ? {price: sort} : 0,
            }
        );
        const badPagination = page && (isNaN(page) || products.page > products.totalPages || page < 1)
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
        logger.error('Handled error', error);
        res.status(500).send(error);
    }
}

const getById = async (req, res) => {
    const id = req.params.pid;
    try {
        const product = await ProductService.findById(id);
        if (!product) {
            res.status(404).send({error: "Product ID not found"});
            return;
        }
        res.status(200).send({product});
    } catch (error) {
        logger.error('Handled error', error);
        res.status(404).send({error: "Product ID not found"});
    }
}

const create = async (req, res) => {
    try {
        const product = req.body;
        const files = req.files;
        product.thumbnails = await files.map(f=> f.originalname)
        const newProduct = await ProductService.create(product);
        configureSocket().getSocketServer().emit('productsModified');
        res.status(201).send({id: newProduct._id});
    } catch (error) {
        const product = req.body;
        console.log(req.files);
        deleteFiles(req.files);
        logger.fatal('Unhandled fatal error', error);
        CustomError.createError({
            name: "Product creation error",
            cause: generateProductErrorInfo(product),
            message: "Error trying to create product",
            code: EErrors.INVALID_TYPES_ERROR
        })
        /* res.status(400).send({error: "Invalid product format or assigned code"}) */
    }
}

const update = async (req, res) => {
    try {
        const id = req.params.pid;
        const data= req.body;
        await ProductService.findByIdAndUpdate(id, data);
        configureSocket().getSocketServer().emit('productsModified');
        res.status(201).send({ModificatedProductID: id})
    } catch (error) {
        logger.error('Handled error', error);
        res.status(404).send({error: 'Product not updated. ID not found'})
    }
}

const remove = async (req, res) => {
    try {
        const pid = req.params.pid;
        const product = await ProductService.findById(pid);
        if(product.owner !== res.user.email && res.user.email !== "adminCoder@coder.com"){
            return res.status(400).send({error: "You can't delete other user products"})
        }
        if(product.thumbnails){
            deleteFiles(product.thumbnails)
        }            
        await ProductService.findByIdAndDelete(pid);
        configureSocket().getSocketServer().emit('productsModified');
        return res.status(201).send({DeletedProductID: pid})
    } catch (error) {
        logger.error('Handled error', error);
        res.status(404).send({error: 'Product not deleted. ID not found'});
    }
}

const mockProducts = async (req, res) => {
    const products = Array.from({ length: 100 }, () => generateProduct());
    res.send({ status: "ok", payload: products });
}

module.exports = {
    upload,
    getAll,
    getById,
    create,
    update,
    remove,
    mockProducts
}