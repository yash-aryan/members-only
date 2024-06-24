const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();

// mongoose setup
mongoose.set('strictQuery', false);

// connect to database
(async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
	} catch (err) {
		console.log(err);
	}
})();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// more middlewares
app.use(logger('dev'));
// app.use(session({ secret: process.env.SECRET_KEY, resave: false, saveUninitialized: true }));
// app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/', require('./routes/index-route'));
app.use('/sign-up', require('./routes/sign-up-route'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
