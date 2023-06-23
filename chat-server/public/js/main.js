// Connect to server.
const socket = io();

const chatMessages = document.querySelector('.chat-messages');
const chatForm = document.getElementById('chat-form');

const {username, channel} = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.timeout(2000).emit('join-channel', {username, channel});

socket.on('message', (message) => {
  /* console.log(message); */
  writeMessage(message);

  // Scroll down automatically.
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit', (event) => {
  // The default behavior is to submit the form data to the current URL
  // (main.js) with the GET method. We don't want to do that.
  event.preventDefault();

  // Emit the submitted text to the server.
  socket.emit('chat-message', event.target.querySelector('#submit-text').value);

  // Clear the input text.
  event.target.querySelector('#submit-text').value = '';
  event.target.querySelector('#submit-text').focus();
});

function writeMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML =
      `<p class='meta'>${message.username} <span>${message.time}</span></p>
      <p class='text'>${message.text}</p>`;
  document.querySelector('.chat-messages').appendChild(div);
}