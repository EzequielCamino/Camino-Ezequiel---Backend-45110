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
async function addProduct(id){
    console.log(id);
/*     const response = await fetch('/api/carts/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
          },
    });
    console.log(response) */
}

function logout() {
    api.post('../../api/users/logout');
}