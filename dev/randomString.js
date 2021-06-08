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
  const digCode = []
  for (let i = 48; i <= 57; i++) {
    digCode.push(i)
  }
  return digCode;
}

const AN_CODE = UPPER_CASE().concat(LOWER_CASE()).concat(DIGITS())

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const randomAlphaNumCode = (code) => code[getRandomInt(code.length)]

const oneRandomChar = () => String.fromCharCode(randomAlphaNumCode(AN_CODE))

const generateRandomString = (length = 6) => {
  return !length?  '' : length && (`${oneRandomChar()}${generateRandomString(length-1)}`);
}


module.exports = { generateRandomString }