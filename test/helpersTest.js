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
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedUser = testUsers["userRandomID"];
    assert.deepEqual(user, expectedUser);
  });

  it('should return undefined with an invalid email', function() {
    const user = getUserByEmail("user3@example.com", testUsers);
    const expectedUser = undefined;
    assert.equal(user, expectedUser);
  });

  it('should return null if not mail is passed', function() {
    const user = getUserByEmail("", testUsers);
    const expectedUser = null;
    assert.equal(user, expectedUser);
  });

});