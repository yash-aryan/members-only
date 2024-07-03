# Members-Only Secret Chat

## Overview

A simple server built using Express to allow authenticated users to send messages. Users can also get authorised as member or admin, allowing certain privileges.

### [View Deployed](https://members-only-twzd.onrender.com/ 'Members Only Secret Chat')

_Sometimes the deployed website may be suspended temporarily by me due to billing reasons_

## Project Details

- The server follows MVC architecture and serves views/html pages in its responses that are built using `ejs` templating language.
- User details and messages are stored in a database using MongoDB on MongoDB Atlas service as cloud database. User's passwords are hashed and salted using `bcrypt` before being stored in the database for security reasons.
- User authentication is handeled using session cookies via `express-session` and `passport` packages.

## Progress

_Project Finished!_

- [x] Create User & Message schemas.
- [x] Connect to MongoDB & Populate dummy data.
- [x] Create logic and page to create account/sign-up.
- [x] Create logic and page to authenticate/log-in users.
- [x] Create logic and page to view and send messages.
- [x] Create logic and page to become member.
- [x] Update UI.
- [x] Setup for production.
- [x] Deployed using PaaS.
