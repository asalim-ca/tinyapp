const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedOutput = "userRandomIDuser@example.com";
    assert.equal(`${user.id}${user.email}`, expectedOutput);
  });
  it('non-existent email should return undefined', function() {
    const user = getUserByEmail("notauser@example.com", testUsers)
    const expectedOutput = undefined;
    assert.equal(user, expectedOutput);
  });
});
