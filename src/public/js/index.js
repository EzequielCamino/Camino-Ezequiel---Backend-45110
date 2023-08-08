const query = new URLSearchParams(window.location.search);
function setPrev(){
    const prevPage = (Number(query.get('page')) || 1) - 1;
    query.set('page', prevPage);
    window.location.search = query.toString();
}
function setNext(){
    const nextPage = (Number(query.get('page')) || 1) + 1;
    query.set('page', nextPage);
    window.location.search = query.toString();
}
async function addProduct(productID, cartID){
    api.post(`/api/carts/${cartID}/products/${productID}`)
    .then((data) => {
        if(!data.message) {
            if(!data.warn){
                return alert('Something went wrong. Please try again');
            }
            return alert(data.warn);
        }
        alert(data.message);
    });
}

async function logout() {
    api.post('../../api/sessions/logout');
}