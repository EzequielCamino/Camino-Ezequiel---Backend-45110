const socket = io();
let user;
let chatBox = document.getElementById('chatBox');

Swal.fire({
    title: 'Identifíquese',
    input: 'email',
    inputLabel: 'Ingrese su email',
    inputPlaceholder: 'email@example.com',
    allowOutsideClick: false
  }).then((result) => {user = result.value})

chatBox.addEventListener('keyup', evt=> {
    if(evt.key==="Enter"){
        if(chatBox.value.trim().length>0){
            socket.emit("message",{user:user, message:chatBox.value});
            chatBox.value="";
        }
    }
})

async function messagesToDB(messages){
    await messageManager.create(messages);
}

socket.on('messageLogs', data=>{
    const log = document.getElementById('messageLogs');
    const p = document.createElement('p');
    let messages = "";
    data.forEach(message=>{
        messages = `${message.user} dice: ${message.message}</br>`
    })
    messagesToDB(messages);
    p.innerHTML = messages;
    log.appendChild(p);
})

