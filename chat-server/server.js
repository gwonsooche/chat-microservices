const path = require('path'); // core module of Node.js
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
// Serve the frontend using static files, rather than an independent
// frontend application.
app.use(express.static(path.join(__dirname, 'public')));

const httpServer = createServer(app);
const io = new Server(httpServer, { /* options, if any */ });

io.on('connection', (socket) => {
  console.log(`Created socket connection with socket id ${socket.id}`);
});

const PORT = process.env.PORT || 3002;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});