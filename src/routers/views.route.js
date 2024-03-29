const { Router } = require("express");
const route = Router();
const productManager = require("../dao/services/mongo/product.service.js")
const productsModel = require("../dao/services/mongo/models/product.model.js");
const cartModel = require("../dao/services/mongo/models/cart.model.js");
const usersModel = require("../dao/services/mongo/models/user.model.js");
const {publicAuth, privateAuth, userAuth, adminAuth} = require("../middlewares/auth.js")
const passport = require('passport');
const { verifyToken } = require('../utils/jwt.js');
const { SITE_URL } = require('../config/config.js');

route.get('/', async (req, res) => {
    const products = await productManager.getAll();
    res.render('index', {
        title: "Backend 45110",
        products
    })
});

route.get('/api/sessions/register', publicAuth,  async (req,res) => {
    res.render('register', {
        title: "Backend 45110 - Register",
    })
})

route.get('/api/sessions/login', publicAuth, async (req,res) => {
    res.render('login', {
        title: "Backend 45110 - Login",
    })
})

route.get('/api/sessions/profile', privateAuth, async (req,res) => {
    const id = req.session.passport.user;
    const user = await usersModel.findOne({_id: id})
    console.log(user);
    res.render('profile', {
        name: user.name,
        lastname: user.lastname,
        age: user.age,
        email: user.email
    })
})

route.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getAll();
    res.render('realTimeProducts', {
        title: "Backend 45110 - Real Time Products",
        products
    })
})

route.get('/products', privateAuth, async (req,res)=>{
    const { page, limit, sort, ...query } = req.query;
    const cartID = req.user.cart._id;
    const products = await productsModel.paginate(
        query,
        {page: page ?? 1,
        limit: limit ?? 10,
        lean: true,
        sort: (sort === "asc" || sort === "desc") ? {price: sort} : 0,
        }
    );
    const badPagination = page && (isNaN(page) || products.page > products.totalPages || page < 1)
    const session = req.session.passport.user;
    const user = await usersModel.findById({_id: session})
    const email = user.email;
    const role = user.role;
    const admin = role === "admin" ? true : false
    res.render('products', {
        title: "Backend 45110 - Products",
        email,
        role,
        cartID,
        admin,
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

route.get('/chat', userAuth, (req, res) => {
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
            cart: JSON.parse(cart)
        })
    } catch (error) {
        res.render('carts', {
            title: "Backend 45110 - Cart",
            cart: false
        })
    }
})

route.get('/api/sessions/recover/:token', async (req, res) => {
    const token = req.params.token;
    try {
        const user = await verifyToken(token)
        const email = user.email;
        const wrongToken = false;
        res.render('recover', {
            email,
            wrongToken,
            SITE_URL
        })
    } catch (error) {
        const wrongToken = true;
        res.render('recover', {
            wrongToken
        })
    }
})

route.get('/api/sessions/dashboard', adminAuth ,async (req, res) => {
    const users = await usersModel.find().lean();
    for (const user of users) {
        if(user.role === "admin"){
            user.admin = true;
        }
    }
    res.render('dashboard', {users});
})

route.get('/api/carts/checkout', passport.authenticate('jwt'), privateAuth, async (req, res) => {
    const cartID = req.user.cart._id;
    const cart = await cartModel.findById({_id: cartID}).populate({path: 'products', populate: {path: 'product'}}).lean();
    const cartProds = [];
    if(cart){
        for (const prod of cart.products) {
            const mock = {
                _id: prod.product._id,
                title: prod.product.title,
                description: prod.product.description,
                code: prod.product.code,
                price: prod.product.price,
                status: prod.product.status,
                stock: prod.product.stock,
                category: prod.product.category,
                owner: prod.product.owner,
                thumbnails: prod.product.thumbnails,
                quantity: prod.quantity
            }
            cartProds.push(mock);
        }
    }
    res.render('checkout', {
        cartProds,
        cartID
    });
})

module.exports = route;