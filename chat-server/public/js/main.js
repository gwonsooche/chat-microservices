// Connect to server.
const socket = io();

const chatMessages = document.querySelector('.chat-messages');

const {username, channel} = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.timeout(2000).emit('join-channel', {username, channel});

socket.on('message', (message) => {
  console.log(message);
  writeMessage(message);

  // Scroll down automatically.
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

function writeMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class='text'>${message}</p>`;
  document.querySelector('.chat-messages').appendChild(div);
}