const { generateRandomString } = require('./dev/randomString')

const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


cookieParser = require('cookie-parser')
app.use(cookieParser())



app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


const users = {}

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  console.log(users)
  const templateVars = {urls: urlDatabase, username: req.cookies["username"]};
  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});


app.get("/urls/:shortURL/edit", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    edit: true,
    username: req.cookies["username"]
  };
  res.render('urls_show', templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    edit: false,
    username: req.cookies["username"]
  };
  res.render('urls_show', templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURl = urlDatabase[req.params.shortURL];
  res.redirect(longURl)
});

app.get("/register", (req, res) => {
  res.render('registrationForm')
});

app.post("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect('/urls')
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls')
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  const templateVars = {
    shortURL,
    longURL: urlDatabase[shortURL],
    edit: false,
    username: req.cookies["username"]
  };
  res.render('urls_show', templateVars);
});

app.post('/login', (req, res) => {

  res.cookie('username', req.body.username)
  res.redirect('/urls')
});

app.post('/logout', (req, res) => {
  res.clearCookie('username')
  res.redirect('/urls')
});

app.post("/register", (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  users[id] = { id, email, password}
  res.cookie('user_id', id);
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


