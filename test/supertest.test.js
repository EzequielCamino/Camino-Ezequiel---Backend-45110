const supertest = require('supertest');
const { expect } = require('chai');

describe('Ecommerce app test', async() => {
    const requester = supertest('http://localhost:8080');
    describe('Products testing', () => {
        it('El endpoint GET /api/products debe traer todos los productos', async ()=>{
            const products = await requester.get('/api/products');
            expect(products._body.payload).to.have.length.greaterThanOrEqual(1);
        })
        it('El endpoint GET /api/products/:pid debe traer un único product', async ()=> {
            const UID = '642a1899e03d0a146ec07be3';
            const product = await requester.get(`/api/products/${UID}`);
            expect(product._body.product._id).to.be.equal(UID);
        })
        it('El endpoint POST /api/products debe impedir que un usuario no loggeado cree un producto', async ()=> {
            const mockProduct = {
                title: 'Test',
                description: 'Test',
                code: 'Test',
                price: 100,
                stock: 10,
                category: 'Test',
            }
            const newProduct = await requester.post('/api/products');
            expect(newProduct.status).to.be.equal(401);
        })
    })
    describe('Carts testing', ()=>{
        const UID = '642bbb9cffbb45bc4bacedce';
        it('El endpoint POST /api/carts debe crear un nuevo carrito', async ()=>{
            const newCart = await requester.post('/api/carts');
            expect(newCart.status).to.be.equal(201);
        })
        it('El endpoint GET /api/carts/:cid debe traer un único carrito', async ()=>{
            const cart = await requester.get(`/api/carts/${UID}`);
            expect(cart._body._id).to.be.equal(UID);
        })
        it('El endpoint POST /api/carts/:cid/purchase debe impedir que un usuario no loggeado compre', async ()=>{
            const purchase = await requester.post(`/api/carts/${UID}/purchase`);
            expect(purchase.status).to.be.equal(401);
        })
    })
    describe('Sessions testing', ()=>{
        it('El endpoint GET /api/sessions/profile debe redireccionar sin estar loggeado', async ()=>{
            const profile = await requester.get('/api/sessions/profile');
            expect(profile.redirect).to.be.true;
        })
        it('El endpoint POST /api/sessions/login debe aceptar un intento de inicio de sesión válido', async ()=>{
            const mockUserOk = {
                email: 'ezeeqii@gmail.com',
                password: 'contraseña'
            }
            const login = await requester.post('/api/sessions/login').send(mockUserOk)
            expect(login.status).to.be.equal(302);
        })
        it('El endpoint POST /api/sessions/login debe rechazar un intento de inicio de sesión inválido', async ()=>{
            const mockUserBad = {
                email: 'ezeeqi@gmail.com',
                password: 'contraseña'
            }
            const login = await requester.post('/api/sessions/login').send(mockUserBad)
            expect(login.status).to.be.not.equal(302);
        })
    })
})

