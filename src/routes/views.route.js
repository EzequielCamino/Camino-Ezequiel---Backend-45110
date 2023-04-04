const { Router } = require("express");
const route = Router();
const productManager = require("../dao/product.manager.js")
const productsModel = require("../dao/models/product.model.js");
const cartModel = require("../dao/models/cart.model.js")

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
    res.render('products', {
        title: "Backend 45110 - Products",
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

route.get('/carts/:cid', async (req,res)=>{
    try {
        const id = req.params.cid;
        const cartData = await cartModel.findById(id).populate('products.product');
        const cart = JSON.stringify(cartData);
        res.render('carts', {
            title: "Backend 45110 - Cart",
            style: "style",
            cart: JSON.parse(cart)
        })
    } catch (error) {
        res.render('carts', {
            title: "Backend 45110 - Cart",
            style: "style",
            cart: false
        })
    }
})

module.exports = route;