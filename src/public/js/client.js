// js for client socket page
const ip_name = document.getElementById('name');
const ip_room = document.getElementById('room');
const btn_join = document.getElementById('btn_join');

const ip_message = document.getElementById('ip_message');
const btn_send = document.getElementById('btn_send');
const ul_message = document.getElementById('ul_message');
const btn_logout = document.getElementById('btn_logout');
const myAuthToken = sessionStorage.token;
const btn_video_call = document.getElementById('btn_video_call')
let currentUserName = ''; 

let socket = io.connect();
socket.on('connect', () => {
  socket.emit('authenticate', {token: myAuthToken});
});
 

btn_join.addEventListener('click', () => {
    const room = ip_room.value;
    if(!myAuthToken){
        alert('You are not logged in, Please login first');
      return window.location.href = '/v1/auth/';
    }
    if (room) {
        socket.emit("join", { token: myAuthToken, room });
        socket.on("join" , (username) =>{
            //set current username for client
            currentUserName = username;
        })
        alert(`${currentUserName} Join room ${room} successfully !!`)
    } else {
        alert('Please enter room');
    }
});

const sendmsg = () => {
    // console.log('send message');
    if(!myAuthToken){
        alert('You are not logged in, Please login first');
      return window.location.href = '/v1/auth/';
    }
    const message = ip_message.value;
    console.log({currentUserName, message});    
    const obj ={ 
        username:currentUserName,
         message ,
         room: ip_room.value
        }
    if (message) {
        socket.emit("message",JSON.stringify(obj));
        ip_message.value = '';
    } else {
        alert('Please enter a message');
    }
}

btn_send.addEventListener('click', sendmsg);


socket.on('thread', (data) => {
    const obj = JSON.parse(data)
    const li = document.createElement("li");
    li.innerText = `${obj.message}`;
    
    if (obj.username === currentUserName) {
        li.classList.add('message-self');
    } else {
        li.classList.add('message-other');
    }
    
    ul_message.appendChild(li);
    ul_message.scrollTop = ul_message.scrollHeight; 
});

ip_message.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') {
        sendmsg();
    }
})

btn_logout.addEventListener('click', () => {
    if(myAuthToken){
        sessionStorage.removeItem('token');
        window.location.href = '/v1/auth/';
    }
    else{
        alert('You are not logged in, Please login first');
        window.location.href = '/v1/auth/';
    }

});

btn_video_call.addEventListener('click', () => {
    if(myAuthToken){
        sessionStorage.removeItem('token');
        window.location.href = '/v1/video-call/';
        sessionStorage.setItem('token', myAuthToken);
    }
    else{
        alert('You are not logged in, Please login first');
        window.location.href = '/v1/auth/';
    }
})