const path = require('path'); // core module of Node.js
const express = require('express');
const {createServer} = require('http');
const {Server} = require('socket.io');

const constructMessage = require('./message');
const {User} = require('./user');
const {addUser, getUser} = require('./users-activity-manager');
const {Logger} = require('./logger');
const logger = new Logger();

const app = express();
// Serve the frontend using static files, rather than an independent
// frontend application.
app.use(express.static(path.join(__dirname, 'public')));

const httpServer = createServer(app);
const io = new Server(httpServer, { /* options, if any */ });

const chatbotName = 'Prompt bot';

io.on('connection', (socket) => {
  logger.info(`Created socket connection with socket id ${socket.id}`);

  socket.on('join-channel', ({username, channel}) => {
    socket.join(channel);

    const user = new User(socket.id, username, channel);
    // Add the new user to the users activity manager.
    addUser(user);

    // Emit welcome message to the single client that's newly joining the
    // channel.
    const welcomeMessage =
        constructMessage(chatbotName, `Welcome to ${channel}!`);
    socket.emit('message', welcomeMessage);

    // Emit to all the other clients in the channel, except the client that's
    // newly joining.
    const joinBroadcastMessage =
        constructMessage(chatbotName, `${username} has joined the channel.`);
    socket.broadcast.to(channel).emit('message', joinBroadcastMessage);
  });
  
  socket.on('chat-message', (messageText) => {
    try {
      const user = getUser(socket.id);
      io.to(user.channel)
          .emit('message', constructMessage(user.username, messageText));
    } catch (err) {
      logger.error(`${err.name}: ${err.message}`);
    }
  });
});

const PORT = process.env.PORT || 3002;

httpServer.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});