//Chat Controller
const { checkAuthToken } = require('../utils/checkAuthToken');

var io = require('socket.io').listen(app);

io.on('connection', (client) => {
    client.auth = false;
    client.on('authenticate', async (data) => {
        // check data được send tới client
        try {
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

    setTimeout(() => {
        //sau 2s mà client vẫn chưa dc auth, thì disconnect.
        if (!client.auth) {
            console.log("Disconnecting socket due to lack of authentication");
            client.disconnect('unauthorized');
        }
    }, 2000);

    // Join room chat
    client.on('join', async (data) => {
        try {
            const result = await checkAuthToken(data.token);
            if (client.auth) {
                const room = data.room;
                const username = result.user.username;
                console.log(`${username} joined room: ${room}`);
                client.join(room);
                client.emit('join', username);
            } else {
                console.log('Client not authenticated');
            }
        } catch (error) {
            console.error('Error joining room:', error);
        }
    });

    client.on('join-room', (roomId, userId) => {
        if (client.auth) {
            console.log(`Connecting to room id: ${roomId}`);
            client.join(roomId);
            setTimeout(() => {
                io.to(roomId).emit('user-connected', userId);
            }, 1000);
        } else {
            console.log('Client not authenticated');
        }
    });

    // Handle incoming messages
    client.on('message', (data) => {
        if (client.auth) {
            try {
                const obj = JSON.parse(data);
                const room = obj.room;
                io.to(room).emit('thread', data);
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        } else {
            console.log('Client not authenticated');
        }
    });
});