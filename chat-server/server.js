const path = require('path'); // core module of Node.js
const express = require('express');
const {createServer} = require('http');
const {Server} = require('socket.io');

const constructMessage = require('./message');

const app = express();
// Serve the frontend using static files, rather than an independent
// frontend application.
app.use(express.static(path.join(__dirname, 'public')));

const httpServer = createServer(app);
const io = new Server(httpServer, { /* options, if any */ });

const chatbotName = 'Prompt bot';

io.on('connection', (socket) => {
  console.log(`Created socket connection with socket id ${socket.id}`);

  socket.on('join-channel', ({username, channel}) => {
    socket.join(channel);

    welcomeMessage = constructMessage(chatbotName, `Welcome to ${channel}!`);
    // Emit welcome message to the single client that's newly joining the
    // channel.
    socket.emit('message', welcomeMessage);

    joinBroadcastMessage =
        constructMessage(chatbotName, `${username} has joined the channel.`);
    // Emit to all the other clients in the channel, except the client that's
    // newly joining.
    socket.broadcast.to(channel).emit('message', joinBroadcastMessage);
  });
  
  socket.on('chat-message', (messageText) => {
    // TODO: Specify user and channel.
    io.emit('message', constructMessage('TODO', messageText));
  });
});

const PORT = process.env.PORT || 3002;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});