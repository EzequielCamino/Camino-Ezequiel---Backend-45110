const { Router } = require("express");
const route = Router();
const productManager = require("../dao/product.manager.js")
const productsModel = require("../dao/models/product.model.js");

route.get('/', async (req, res) => {
    const products = await productManager.getAll();
    res.render('index', {
        title: "Backend 45110",
        style: "style",
        products
    })
});

route.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getAll();
    res.render('realTimeProducts', {
        title: "Backend 45110",
        style: "style",
        products
    })
})

route.get('/products', async (req,res)=>{
    const query = req.query;
    const products = await productsModel.paginate(
        {},
        {page: query.page ?? 1,
        limit: query.limit ?? 10,
        lean: true,
        sort: (query.sort === "asc" || query.sort === "desc") ? {price: query.sort} : 0,
        }
    );
    const badPagination = query.page && (isNaN(query.page) || products.page > products.totalPages || query.page < 1)
    res.render('products', {
        title: "Backend 45110",
        style: "style",
        products: products.docs,
        pages: products.totalPages,
        page: products.page,
        prev: products.prevPage,
        next: products.nextPage,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        badPagination
    });
})

route.get('/chat', (req, res) => {
    res.render('message');
});

route.get('/cookies', (req, res) =>{
    res.render('cookies');
})

module.exports = route;