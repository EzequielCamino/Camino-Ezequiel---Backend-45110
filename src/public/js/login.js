async function login(event) {
    event.preventDefault();
    const email = document.getElementById('form-email').value;
    const password = document.getElementById('form-password').value;
    api.post('/api/users/login', {
        email,
        password
    })
    .then((data) => {
        console.log(data)
        if(data.ok === false) {
            return alert("User not found. Please check username or password")
        }
    })
}