const { ALPHANUMERIC_CODES } = require('./bin/alphaNumCharCodes')

const generateRandomKey = (max) => Math.floor(Math.random() * max);

const generateRandomAlphaNumCode = (code) => code[generateRandomKey(code.length)]

const generateRandomChar = () => String.fromCharCode(generateRandomAlphaNumCode(ALPHANUMERIC_CODES))

const generateRandomString = (length = 6) => !length?  '' : length && (`${generateRandomChar()}${generateRandomString(length-1)}`);

module.exports = { generateRandomString }