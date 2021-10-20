const users = [];

const addUser = async (userId, socketId) => {
  const user = users.find((user) => user.userId === userId);

  if (user && user.socketId === socketId) {
    return users;
  }
  //
  else {
    const newUser = { userId, socketId };

    users.push(newUser);
    if (user && user.socketId !== socketId) {
      removeUser(user.socketId);
    }

    return users;
  }
};

const removeUser = (socketId) => {
  const indexOf = users.map((user) => user.socketId).indexOf(socketId);

  users.splice(indexOf, 1);

  return;
};

const findConnectedUser = (userId) =>
  users.find((user) => user.userId === userId);

const getUsers = async () => {
  return users
}

module.exports = { addUser, removeUser, findConnectedUser, getUsers };
