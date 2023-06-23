const {DateTime} = require('luxon');

function constructMessage(username, text) {
  return {
    username,
    text,
    time: DateTime.now(),
  };
}

module.exports = constructMessage;