const getUserByEmail = (email, database) => database[Object.keys(database).find( user => database[user].email === email)];

module.exports = { getUserByEmail }