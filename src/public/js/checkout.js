async function checkout(cartID) {
    api.post(`/api/carts/${cartID}/purchase`)
    .then((data) => {
        console.log(data);
        if(!data.message){
            return alert(data.error)
        }
        const notBuyed = []
        data.NotBuyedProducts.forEach(product => {
            const prod = {
                Product: product.product,
                Quantity: product.quantity
            }
            notBuyed.push(prod)
        })
        const tableInfo = [];
        for (const product of notBuyed) {
            const mock =
            `<tr>
                <td>${product.Product}</td>
                <td>${product.Quantity}</td>
            </tr>`
            tableInfo.push(mock);
        }
        Swal.fire({
            title: "Purchase completed",
            html: `Not Buyed Products:
                    <table class="table">
                        <thead>
                            <th>Product ID</th>
                            <th>Quantity</th>
                        </thead>
                        <tbody>
                            ${tableInfo}
                        </tbody>
                    </table>`,
            icon: 'success'
        }).then(()=>{
            location.reload();
        });
    });
}

async function removeProduct(productID, cartID){
    api.delete(`/api/carts/${cartID}/products/${productID}`)
    .then(()=>{
        location.reload();
    });
}