/** User constructor */
function User(socketId, username, channel) {
  this.id = socketId;
  this.username = username;
  this.channel = channel;
}