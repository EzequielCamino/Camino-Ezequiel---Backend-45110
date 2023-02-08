class ProductManager {
    static idCreator = 0;
    constructor() {
        this.products = [];
    }
    addProduct(title, description, price, thumbnail, code, stock) {
        if(this.products.find((product) => product.code === code)) {
            return console.log("Code assigned");
        } else if(title && description && price && thumbnail && stock) {
            ProductManager.idCreator++;
            const id = ProductManager.idCreator
            const product = {id, title, description, price, thumbnail, code, stock}
            this.products.push(product);
        } else {
            return console.log("Faltan completar datos")
        }
    }
    getProducts() {
        return console.log(this.products)
        return this.products;
    }
    getProductById(id){
        return console.log(this.products.find((product) => product.id === id) || "Code not found");
        return this.products.find((product) => product.id === id) || "Code not found"
    }
}


/* TESTING CODE */

/* let newProducts = new ProductManager;
newProducts.addProduct("a", "b", 10, "no", 45, 20);
newProducts.addProduct("a", "b", 10, "no", 45, 20);
newProducts.addProduct("a", "b", 10, "no", 54, 20);
newProducts.getProducts()
newProducts.getProductById(2);
newProducts.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
newProducts.getProducts()
newProducts.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
newProducts.addProduct("producto prueba2", "Este es otro producto prueba", 200, "Sin imagen", "abc1234", 25);
newProducts.getProductById(5);
newProducts.getProductById(2); */