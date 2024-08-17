// js for client socket page 
const ip_room = document.getElementById('room'); 
const btn_join = document.getElementById('btn_join'); 

const ip_message = document.getElementById('ip_message'); 
const btn_send = document.getElementById('btn_send'); 
const ul_message = document.getElementById('ul_message'); 
const btn_logout = document.getElementById('btn_logout'); 
const btn_video_call = document.getElementById('btn_video_call'); 

// Lấy token xác thực từ sessionStorage
const myAuthToken = sessionStorage.token;
let currentUserName = ''; 

// Gửi yêu cầu kết nối tới server qua Socket.IO
let socket = io.connect(); // `io` được cung cấp bởi thư viện Socket.IO client

// Gửi token để xác thực người dùng
socket.on('connect', () => {
    socket.emit('authenticate', {token: myAuthToken});
});

// Lắng nghe sự kiện 'user-connected'
socket.on('user-connected', (username) => {
    const ul_message = document.getElementById('ul_message');
    const li = document.createElement("li");
    li.innerText = `User ${username} has joined the room.`;
    li.classList.add('notification'); 
    ul_message.appendChild(li);
    ul_message.scrollTop = ul_message.scrollHeight;
});

btn_join.addEventListener('click', () => {
    const room = ip_room.value; 
    if(!myAuthToken){
        alert('You are not logged in, Please login first');
        return window.location.href = '/api/auth/';
    }
    // Nếu có tên phòng, gửi yêu cầu tham gia phòng tới server
    if (room) {
        socket.emit("join", { token: myAuthToken, room });
        // Lắng nghe sự kiện "join" từ server để nhận tên người dùng
        socket.on("join", (username) =>{
            currentUserName = username;
        });
        alert(`${currentUserName} Join room ${room} successfully !!`);
    } else {
        alert('Please enter room');
    }
});

// Hàm gửi tin nhắn
const sendmsg = () => {
    if(!myAuthToken){
        alert('You are not logged in, Please login first');
        return window.location.href = '/api/auth/';
    }
    const message = ip_message.value; 
    console.log({currentUserName, message});
    
    // Đóng gói dữ liệu tin nhắn vào đối tượng
    const obj ={ 
        username: currentUserName,
        message: message,       
        room: ip_room.value        
    };
    
    // gửi tin nhắn tới server qua sự kiện "message"
    if (message) {
        socket.emit("message", JSON.stringify(obj));
        ip_message.value = ''; 
    } else {
        alert('Please enter a message');
    }
}

// Khi người dùng nhấn nút "Send", gọi hàm gửi tin nhắn
btn_send.addEventListener('click', sendmsg);

// Lắng nghe sự kiện "thread" từ server để nhận tin nhắn mới
socket.on('thread', (data) => {
    const obj = JSON.parse(data); 
    const li = document.createElement("li"); 
    li.innerText = `${obj.message}`; // Đặt nội dung tin nhắn vào phần tử <li>
    
    // CSS phân biệt tin nhắn của người dùng với người khác
    if (obj.username === currentUserName) {
        li.classList.add('message-self'); // Tin nhắn của người dùng hiện tại
    } else {
        li.classList.add('message-other'); // Tin nhắn của người khác
    }
    
    // Thêm tin nhắn mới vào danh sách và cuộn xuống cuối cùng
    ul_message.appendChild(li);
    ul_message.scrollTop = ul_message.scrollHeight; 
});

// Khi người dùng nhấn phím Enter trong ô nhập tin nhắn, gọi hàm gửi tin nhắn
ip_message.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') {
        sendmsg();
    }
});

// Sự kiện khi người dùng nhấn nút "Logout"
btn_logout.addEventListener('click', () => {
    if(myAuthToken){
        sessionStorage.removeItem('token'); // Xóa token khỏi sessionStorage
        window.location.href = '/api/auth/'; // Chuyển hướng về trang đăng nhập
    } else {
        alert('You are not logged in, Please login first');
        window.location.href = '/api/auth/';
    }
});

// Sự kiện khi người dùng nhấn nút "Video Call"
btn_video_call.addEventListener('click', () => {
    if(myAuthToken){
        window.location.href = '/api/video-call/'; // Chuyển hướng tới trang gọi video
        sessionStorage.setItem('token', myAuthToken); // Lưu lại token để sử dụng tiếp
    } else {
        // Nếu người dùng chưa đăng nhập, yêu cầu đăng nhập
        alert('You are not logged in, Please login first');
        window.location.href = '/api/auth/';
    }
});
