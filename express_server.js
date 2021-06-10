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
  const user_id = req.cookies["user_id"]
  const templateVars = {urls: urlDatabase[user_id], user: users[user_id]};
  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  const user_id = req.cookies["user_id"]
  user_id ? res.render("urls_new") : res.redirect('/login');
});


app.get("/urls/:shortURL/edit", (req, res) => {
  const user_id = req.cookies["user_id"]
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[user_id][req.params.shortURL],
    edit: true,
    user: users[user_id]
  };
  res.render('urls_show', templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const user_id = req.cookies["user_id"]
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[user_id][req.params.shortURL],
    edit: false,
    user: users[user_id]
  };
  res.render('urls_show', templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const user_id = req.cookies["user_id"]
  const longURl = urlDatabase[user_id][req.params.shortURL];
  res.redirect(longURl)
});

app.get("/register", (req, res) => {
  res.render('regist_form', {user: {}})
});

app.get("/login", (req, res) => {
  res.render('login_form', {user: {} })
});

app.post("/urls/:shortURL/edit", (req, res) => {
  const user_id = req.cookies["user_id"]
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[user_id][shortURL] = longURL;
  res.redirect('/urls')
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const user_id = req.cookies["user_id"]
  const shortURL = req.params.shortURL;
  delete urlDatabase[user_id][shortURL];
  res.redirect('/urls')
});

app.post("/urls", (req, res) => {
  const user_id = req.cookies["user_id"]

  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[user_id] = { shortURL:longURL };
  const templateVars = {
    shortURL,
    longURL: urlDatabase[user_id][shortURL],
    edit: false,
    user: users[user_id]
  };
  res.render('urls_show', templateVars);
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  
  //This is just to finish the work, need refactoring implementing a proper function
  const emailExists = Object.keys(users).some( user => users[user].email === email);
  const indexUser = Object.keys(users).findIndex( user => users[user].email === email);
  const id = emailExists && Object.keys(users)[indexUser];

  if (!emailExists || users[id].password !== password) {
    res.status(403).send('Something went wrong!')
  } else {
    res.cookie('user_id', id);
    res.redirect('/urls');
  }
});

app.post('/logout', (req, res) => {
  res.clearCookie('user_id')
  res.redirect('/urls')
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!password || !email || Object.keys(users).some( user => users[user].email === email)) {
    res.status(400).send('Something went wrong!')
  } else {
    const id = generateRandomString();
    users[id] = { id, email, password }
    res.cookie('user_id', id);
    res.redirect('/urls');
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


