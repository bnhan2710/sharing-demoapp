const { checkAuthToken } = require('../utils/checkAuthToken');

var io = require('socket.io').listen(app);

// Thiết lập sự kiện khi một client kết nối đến server
io.on('connection', (client) => {
    client.auth = false;

    // Lắng nghe sự kiện 'authenticate' từ client để xác thực
    client.on('authenticate', async (data) => {
        try {
            // Kiểm tra token gửi từ client
            const result = await checkAuthToken(data.token);
            if (result.statusCode === 200) {
                console.log("Authenticated socket ", result.user.username);
                client.auth = true;
            } else {
                console.log("Authentication failed for socket");
                client.disconnect('unauthorized');
            }
        } catch (error) {
            console.error('Authentication error:', error);
            client.disconnect('unauthorized');
        }
    });

    // Sau 2 giây, nếu client chưa được xác thực thì ngắt kết nối
    setTimeout(() => {
        if (!client.auth) {
            console.log("Disconnecting socket due to lack of authentication");
            client.disconnect('unauthorized');
        }
    }, 2000);

    // Lắng nghe sự kiện 'join' từ client để tham gia phòng chat bằng tên phòng
    client.on('join', async (data) => {
        try {
            const result = await checkAuthToken(data.token);
            if (client.auth) {
                const room = data.room;
                const username = result.user.username;
                console.log(`${username} joined room: ${room}`);
                client.join(room);
                // Thông báo cho các client trong phòng về việc người dùng mới kết nối
                io.to(room).emit('user-connected', username);
                // Gửi tên người dùng về client khi tham gia phòng
                client.emit('join', username);
            } else {
                console.log('Client not authenticated');
            }
        } catch (error) {
            console.error('Error joining room:', error);
        }
    });

    // Lắng nghe sự kiện 'join-room' từ client để tham gia phòng chat bằng ID phòng
    client.on('join-room', (roomId, username) => {
        if (client.auth) {
            console.log(`Connecting to room id: ${roomId}`);
            client.join(roomId);
            // Thông báo cho các client trong phòng về việc người dùng mới kết nối
            setTimeout(() => {
                io.to(roomId).emit('user-connected', username);
            }, 1000);
        } else {
            console.log('Client not authenticated');
        }
    });

    // Lắng nghe sự kiện 'message' từ client để xử lý tin nhắn mới gửi
    client.on('message', (data) => {
        if (client.auth) {
            try {
                const obj = JSON.parse(data);
                const room = obj.room;
                // Phát tin nhắn đến tất cả client trong phòng chat
                io.to(room).emit('thread', data);
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        } else {
            console.log('Client not authenticated');
        }
    });
});
