let socket = io.connect();
const myAuthToken = sessionStorage.token;
socket.on('connect', () => {
  socket.emit('authenticate', {token: myAuthToken});
});

const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

var peer = new Peer({
  host: '127.0.0.1',
  port: 8000,
  path: '/peerjs',
});


//lấy quyền truy cập camera và microphone
let myVideoStream;
navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
    // peer nhận được sự kiện call từ người dùng khác
    peer.on("call", (call) => {
      console.log('someone call me');
      //trả lời cuộc gọi và gửi video stream của mình
      call.answer(stream);
      const video = document.createElement("video");
      //thêm video stream của người dùng khác vào video element
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });
//gửi sự kiện user-connected tới server
    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });
  });

//khi có người dùng truy cập đến link video call
const connectToNewUser = (userId, stream) => {
  console.log('I call:' + userId);
  //gọi đến id của người dùng khác
  const call = peer.call(userId, stream);
  //tạo video element mới
  const video = document.createElement("video");
  //thêm video stream vào video element
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
};

// mở kết nối peer
peer.on("open", (id) => {
  console.log('My id: ' + id);
  console.log('Room id:' + ROOM_ID)
  //gửi id và room id tới server để join room
  socket.emit("join-room", ROOM_ID, id);
});


//thêm src vào grid
const addVideoStream = (video, stream) => { 
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
    videoGrid.append(video);
  });
};

const inviteButton = document.querySelector("#inviteButton");
const muteButton = document.querySelector("#muteButton");
const stopVideo = document.querySelector("#stopVideo");
const disconnectBtn = document.querySelector("#disconnect");

muteButton.addEventListener("click",() => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if(enabled){
    myVideoStream.getAudioTracks()[0].enabled = false;
    html = `<i class="fas fa-microphone-slash"></i>`;
    muteButton.classList.toggle("background_red");
    muteButton.innerHTML = html;
  }
  else{
    myVideoStream.getAudioTracks()[0].enabled = true;
    html = `<i class="fas fa-microphone"></i>`;
    muteButton.classList.toggle("background_red");
    muteButton.innerHTML = html;
  }
})

stopVideo.addEventListener("click",() => {
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
  if(enabled){
    myVideoStream.getVideoTracks()[0].enabled = false;
    html = `<i class="fas fa-video-slash"></i>`;
    stopVideo.classList.toggle("background_red");
    stopVideo.innerHTML = html;
  }
  else{
    myVideoStream.getVideoTracks()[0].enabled = true;
    html = `<i class="fas fa-video"></i>`;
    stopVideo.classList.toggle("background_red");
    stopVideo.innerHTML = html;
  }
})

inviteButton.addEventListener("click",() => {
  prompt("Copy this link and send it to people you want to have video call with",
  window.location.href
  );
})

disconnectBtn.addEventListener("click",() => {
    //đóng kết nối peer
  peer.destroy();
  const myVideoElement = document.querySelector("video");
  if(myVideoElement){
    myVideoElement.remove();
  }
  window.location.href = "/v1/chat"; 
})