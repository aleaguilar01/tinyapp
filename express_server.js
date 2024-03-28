/**
 * Backend endpoint colecction for TinyApp.
 * @author Alejandra Aguilar
 */

const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

/**
 * Endpoint to fetch all urls saved in the database
 */
app.get("/urls", (req, res) => {
  const urls = { urls: urlDatabase};
  res.render("urls_index", urls);
});

/**
 * Endpoint to fetch one url saved in the database
 * @param id refers to the short url id.
 * @returns Individual Url Page.
 */
app.get(`/urls/:id`, (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  res.render("urls_show.ejs", {id, longURL});
});

app.get("/hello", (req, res) => {
  const templateVars = { greeting: "Hello World!" };
  res.render("hello_world", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});