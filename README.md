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

- This is a runtime error and depends on user's input, what I understand is `res.redirect(someUrl)` only redirects when `someUrl` verifies  a complete format with http://... or https://..., "www.somedomain.wte" or "somedomain.wte"will definitely return the error mentioned. For futur refactoring I'll try to implement an `urlVerfication()` to check urls before adding them or editing them.
