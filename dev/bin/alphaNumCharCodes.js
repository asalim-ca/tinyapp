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


module.exports = { ALPHANUMERIC_CODES }