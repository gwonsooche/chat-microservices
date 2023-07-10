/**
 * Module that manages active users and their activities.
 * 
 * Design decision: we use the module system to manage active users, instead of
 * using the typical OOP tools. We might want to connect to DB later.
 */

const {User} = require('./user');

// Hash table from "user id"s to "user"s
const activeUsers = new Map();

/**
 * Adds the user to the manager.
 * 
 * Design decision (dependency injection): the manager takes a new user instead
 * of creating it internally (where the manager would need to take the user
 * information such as socket id and username in order to create one).
 * @param {User} user The newly (socket-)connected user to add.
 */
function addUser(user) {
  if (activeUsers.has(user.id)) {
    const logText = `The user with id ${user.id} and username ${user.username}
        already exists`;
    console.log(logText);

    return;
  }

  activeUsers.set(user.id, user);
  console.log(`Added new user ${JSON.stringify(user)} to the user activity manager`);
}

/**
 * Returns the user that corresponds to the given user id.
 * 
 * Design decision: when there is no such user with the given id, this function
 * throws an exception, instead of returning `undefined`.
 * @param {string} id 
 */
function getUser(id) {
  if (!activeUsers.has(id)) {
    throw new Error(`No such user with the user id ${id}`);
  }

  return activeUsers.get(id);
}

module.exports = {
  addUser,
  getUser,
};