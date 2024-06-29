# Members-Only Secret Chat

A simple server built using Express to allow authenticated users to send messages. Users can also get authorised as member or admin, allowing certain privileges.

The server sends html in its response built using `ejs`

User details and messages are stored in a database using MongoDB on MongoDB Atlas. User's passwords are hashed and salted using `bcryptjs` before being stored in the database for security reasons.

# Todos

- [x] Create User & Message schemas.
- [x] Connect to MongoDB & Populate dummy data.
- [x] Create logic and page to create account/sign-up.
- [x] Create logic and page to authenticate/log-in users.
- [x] Create logic and page to view and send messages.
- [x] Create logic and page to become member.
- [x] Setup for production.
