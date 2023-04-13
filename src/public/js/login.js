async function login(event) {
    event.preventDefault();
    const email = document.getElementById('form-email').value;
    const password = document.getElementById('form-password').value;
    api.post('/api/users/login', {
        email,
        password
    })
    .then((data) => {
        if(!data._id) {
            return alert("User not found. Please check username or password")
        }
    })
}