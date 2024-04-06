const { assert } = require('chai');

const { getUserByEmail, urlsForUser } = require('../helpers.js');

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

const testUrls = {
  "abcd": {
    longUrl: "www.google.com",
    userID: "userRandomID"
  },
  "123": {
    longUrl: "www.gmail.com",
    userID: "userRandomID"
  },
  "sebfg": {
    longUrl: "www.hotmail.com",
    userID: "user2RandomID"
  },
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

describe('urlsForUser', function() {
  it('should return an object with the users urls', () => {
    const urlsObject = urlsForUser("userRandomID", testUrls);
    const expdectedurlsObject = {
      "abcd": {
        longUrl: "www.google.com",
        userID: "userRandomID"
      },
      "123": {
        longUrl: "www.gmail.com",
        userID: "userRandomID"
      },
    };
    assert.deepEqual(urlsObject, expdectedurlsObject);
  });

  it('should return an empty object if the user has no urls stored', () => {
    const urlsObject = urlsForUser("user3RandomID", testUrls);
    const expdectedurlsObject = {};
    assert.deepEqual(urlsObject, expdectedurlsObject);
  });

});
