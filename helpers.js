//Find user in DB by email
const getUserByEmail = (email, database) => database[Object.keys(database).find(user => database[user].email === email)];

const getUserDatabase = (id, database) => {
  const ret = {};
  Object.keys(database).filter(tinyUrl => database[tinyUrl].userID === id).forEach(tinyUrl => {
    const longURL = database[tinyUrl].userID;
    ret[tinyUrl] = { longURL, id };
  });
  return ret;
};

const userHasUrl = (userDB, url) => Object.keys(userDB).some(tinyUrl => tinyUrl === url);


module.exports = { getUserByEmail, getUserDatabase, userHasUrl };