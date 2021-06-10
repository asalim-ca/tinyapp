# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["screenshot description"](#)
!["screenshot description"](#)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

## About - TypeError: Cannot read property 'longURL' of undefined -

- This is a runtime error and it will depend on the long URL provided by user, What I understand `res.redirect(someUrl)` will only redirect if `someUrl` is in a complete format  http://someDomin.wte or http://www.someDomin.wte, a `someIncompleteUrl` will definitely return the error discussed. for later versions I'll try to implement an `urlVerfication()` to check urls before adding them or editing them.
