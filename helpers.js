/////////////////////////////////// HELPERS ///////////////////////////////////////////////

/**
 * Function to generate a random string thar will be use as a unique identifier for tinyurls
 * @param {number} lengthOfId
 * @returns {string}
 */
const generateRandomString = (lengthOfId) => {
  let randomString = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let n = 0; n < lengthOfId; n++) {
    randomString += characters[Math.floor(Math.random() * characters.length)];
  }
  return randomString;
};

/**
 * Function to check if an user exists into the database.
 * @param {string} id
 * @param {object} database
 * @returns {object}
 */

const getUserByEmail = (email, database) => {
  const id = Object.keys(database).find(key => database[key].email === email);
  if (id) {
    return database[id];
  }
  return null;
};

/**
 * Function to obtain the urls for a particular user
 * @param {string} id
 * @returns {object}
 */

const urlsForUser = (id, database) => {
  const userUrls = {};
  for (let url in database) {
    if (database[url].userID === id) {
      userUrls[url] = database[url];
    }
  }
  return userUrls;
};

/**
 * Function to validate if user is valid and logged in
 * @param {object} req - The request object.
 * @param {object} res - The response object
 * @returns {string}
*/
const validateLogin = (req, res, shouldRedirect = false) => {
  const userId = req.session.userId;
  if (!userId) {
    if (shouldRedirect) {
      res.redirect("/login");
    } else {
      res.status(401).render("status401");
    }
   
  } else {
    return userId;
  }
};

/**
 * Function that validates ownership of a URL in the database and executes a callback
 * if valid.
 * @param {object} req - The request object.
 * @param {object} res - The response object
 * @param {Function} callback - Callback function to execute if url ownership is valid
 * @returns {string} - Id of the valid url
 */
const validateUrlOwnership = (req, res, urlDatabase, userDatabase, callback)=> {
  const userID = validateLogin(req, res);
  if (userID) {
    const id = req.params.id;
    // Checks if the id exists in the database
    const urlObject = urlDatabase[id];
    if (urlObject) {
      // Validates ownership of the URL
      if (urlObject.userID === userID) {
        callback(id, userDatabase[userID]);
      } else {
        res.status(403).render("status403");
      }
    } else {
      res.status(404).render("status404");
    }
  }
  
};

module.exports = {
  generateRandomString,
  getUserByEmail,
  urlsForUser,
  validateLogin,
  validateUrlOwnership
};