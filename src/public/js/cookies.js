async function setCookie(event) {
    event.preventDefault();
    const user = document.getElementById('user').value;
    const userEmail = document.getElementById('userEmail').value;
    await fetch('/api/sessions/setcookie', {
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
    await fetch('/api/sessions/getcookie', {
        method: 'GET',
    })
}