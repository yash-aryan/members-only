const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const debug = require('debug');
const compression = require('compression');
const helmet = require('helmet');
const RateLimit = require('express-rate-limit');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./models/user-model');
const indexRouter = require('./routes/index-route');
const { log_in_get, log_out_get } = require('./controllers/auth-controller');

require('dotenv').config();

const app = express();

// mongoose setup
mongoose.set('strictQuery', false);

// connect to database
(async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
	} catch (err) {
		debug(err);
	}
})();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// more middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(compression());
app.use(helmet());

// sets rate limit - max 20 req per minute
const limiter = RateLimit({
	windowMs: 1 * 60 * 1000, // 1 minute
	max: 20,
});
app.use(limiter);

// sets session ID cookie
app.use(
	session({
		secret: process.env.SECRET_KEY,
		resave: false,
		saveUninitialized: true,
	})
);

// sets background processes for passport during passport.authenticate()
app.use(passport.session());
passport.use(
	new LocalStrategy(async (name, password, done) => {
		try {
			const user = await User.findOne({ name }).exec();

			if (!user) return done(null, false, { message: 'Incorrect username!' });

			const passwordMatch = await bcrypt.compare(password, user.password);

			if (!passwordMatch) return done(null, false, { message: 'Incorrect password!' });

			return done(null, user);
		} catch (err) {
			return done(err);
		}
	})
);
passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findById(id).exec();
		done(null, user);
	} catch (err) {
		done(err);
	}
});

// forces page reload on page navigation
app.use((req, res, next) => {
	res.set(
		'Cache-Control',
		'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'
	);
	next();
});

// routes
app.use('/', require('./routes/index-route'));
app.use('/sign-up', require('./routes/sign-up-route'));
app.use('/membership', require('./routes/membership-route'));

// login/logout routing
app.get('/log-in', log_in_get);
app.post(
	'/log-in',
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/log-in',
	})
);
app.get('/log-out', log_out_get);

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
