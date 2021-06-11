// Generate random string
const UPPER_CASE = () => {
  const upCaseCode = []
  for (let i = 65; i <= 90; i++) {
    upCaseCode.push(i)
  }
  return upCaseCode;
}

const LOWER_CASE = () => {
  const lowCaseCode = []
  for (let i = 97; i <= 122; i++) {
    lowCaseCode.push(i)
  }
  return lowCaseCode;
}

const DIGITS = () => {
  const digiCode = []
  for (let i = 48; i <= 57; i++) {
    digiCode.push(i)
  }
  return digiCode;
}

const ALPHANUMERIC_CODES = UPPER_CASE().concat(LOWER_CASE()).concat(DIGITS())

const generateRandomKey = (max) => Math.floor(Math.random() * max);

const generateRandomAlphaNumCode = (code) => code[generateRandomKey(code.length)]

const generateRandomChar = () => String.fromCharCode(generateRandomAlphaNumCode(ALPHANUMERIC_CODES))

const generateRandomString = (length = 6) => !length?  '' : length && (`${generateRandomChar()}${generateRandomString(length-1)}`);


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

// User is the owner of the an URL
const userHasUrl = (userDB, url) => Object.keys(userDB).some(tinyUrl => tinyUrl === url);


module.exports = { getUserByEmail, getUserDatabase, userHasUrl, generateRandomString };