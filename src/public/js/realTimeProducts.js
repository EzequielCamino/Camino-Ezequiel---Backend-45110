const socket = io();
socket.on('productsModified', () => {
    location.reload();
})