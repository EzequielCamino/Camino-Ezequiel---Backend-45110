async function login(event) {
    event.preventDefault();
    const email = document.getElementById('form-email').value;
    const password = document.getElementById('form-password').value;
    api.post('/api/sessions/login', {
        email,
        password
    })
    .then((data) => {
        if(data.ok === false) {
            return alert("User not found. Please check username or password")
        }
    })
}

async function recover(){
    const email = document.getElementById('form-email').value;
    if (!email){
        return alert("Please type your registered email");
    }
    api.post('/api/sessions/recover', {
        email
    })
    .then((data) => {
        if(data.status === "error"){
            return alert("User not found. Please check you entered a registered email");
        }
        if(data.status === "success"){
            return alert("An email has been sent to your registered email");
        }
        return alert("Ups! You shouldn't be seeing this error. Please try again");
    })
}

async function restore(event){
    event.preventDefault()
    const email = document.getElementById('form-email').value;
    const password = document.getElementById('form-password').value;
    const password2 = document.getElementById('form-password2').value;
    console.log(email);
    if(password !== password2){
        return alert("Passwords doesn't match. Please try again");
    }
    if(!password || !password2){
        return alert("Please type 2 times new password");
    }
    console.log(email)
    console.log(password)
    api.post('/api/sessions/restore', {
        email,
        password
    })
    .then((data) => {
        if(data.status === "error"){
            return alert("Something went wrong. Please create a new password recover link");
        }
        if(data.status === "success"){
            return alert("Your password was successfully changed");
        }
        if(data.status === "passwordError"){
            return alert("Your new password can't be the same as your old password");
        }
        return alert("Ups! You shouldn't be seeing this error. Please try again");
    })
}