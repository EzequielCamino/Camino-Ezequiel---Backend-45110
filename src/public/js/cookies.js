async function setCookie(event) {
    event.preventDefault();
    const user = document.getElementById('user').value;
    const userEmail = document.getElementById('userEmail').value;
    await fetch('/cookies/setcookie', {
      method: 'POST',
      body: JSON.stringify({
        user, userEmail
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

async function getCookie(){
    await fetch('/cookies/getcookie', {
        method: 'GET',
    })
}