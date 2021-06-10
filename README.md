# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["Root/Home page"](https://github.com/asalim-ca/tinyapp/blob/master/docs/home-page.png?raw=true)
!["Login page"](https://github.com/asalim-ca/tinyapp/blob/master/docs/login-page.png?raw=true)
!["My urls"](https://github.com/asalim-ca/tinyapp/blob/master/docs/myurls-page.png?raw=true)
!["Editing URL"](https://github.com/asalim-ca/tinyapp/blob/master/docs/edit-page.png?raw=true)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `npm start` command.
- For tests run `npm start` command.

## About - TypeError: Cannot read property 'longURL' of undefined -

- This is a runtime error and depends on user's input, what I understand is `res.redirect(someUrl)` only redirects when `someUrl` verifies  a complete format with http://... or https://..., www.somedomain.wte or "somedomain.wte" will definitely return the error mentioned. For future refactoring I'll try to implement an `urlVerfication()` to check urls before adding them or editing them.

## dev folder

- I've created this folder in the beggining of the project to carry `generateRandomString`, after that with the implementation of `helpers.js` I tought about passing `generateRandomString` to it but it would not make this more readable so for now it stays! probably it will disapear in future refactorings.
