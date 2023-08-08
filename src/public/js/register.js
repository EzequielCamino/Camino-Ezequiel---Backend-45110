async function register(event) {
    event.preventDefault();
    const name = document.getElementById('form-name').value;
    const lastname = document.getElementById('form-lastname').value;
    const email = document.getElementById('form-email').value;
    const age = document.getElementById('form-age').value;
    const password = document.getElementById('form-password').value;
    
    api.post('/api/sessions/register', {
        name,
        lastname,
        email,
        age,
        password
    })
    .then((data) => {
        if(!data._id) {
            return alert('User already registered or incomplete data.')
        }
        Swal.fire({
            title: "¡User registered OK!",
            html: `User ID is ${data._id}`,
            icon: 'success'
        }).then(()=>{
            window.location.href = "/products";
        });
    })
}
