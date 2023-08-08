const socket = io();
socket.on('usersModified', () => {
    location.reload();
});

function changeRole(id){
    api.post(`/api/sessions/changeRole`, {id});
};

function deleteUser(id){
    api.delete(`/api/sessions/deleteUser/${id}`);
};

function deleteInactive(){
    api.delete('/api/sessions/');
}