const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const users = new Map();
const messages = [];

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  socket.on('join', (username) => {
    users.set(socket.id, username);
    io.emit('userList', Array.from(users.values()));
    io.emit('messageHistory', messages);
    io.emit('systemMessage', `${username} se unió al chat`);
  });

  socket.on('chatMessage', (msg) => {
    const message = {
      id: Date.now(),
      user: users.get(socket.id),
      text: msg,
      timestamp: new Date().toISOString()
    };
    messages.push(message);
    io.emit('chatMessage', message);
  });

  socket.on('disconnect', () => {
    const username = users.get(socket.id);
    if (username) {
      io.emit('systemMessage', `${username} salió del chat`);
      users.delete(socket.id);
      io.emit('userList', Array.from(users.values()));
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});