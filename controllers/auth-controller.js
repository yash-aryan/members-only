const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/user-model.js');
require('dotenv').config;

// GET signup
exports.sign_up_get = asyncHandler(async (req, res, next) => {
	if (req.user) return res.redirect('/');

	res.render('sign-up');
});

// POST signup
const userValidator = [
	body('username')
		.trim()
		.isLength({ min: 3 })
		.withMessage('Username must contain at least 3 characters!')
		.custom(async value => {
			const user = await User.findOne({ name: value }).exec();

			if (user) throw new Error('Username already in use! be more creative, lad!');
		})
		.escape(),
	body('email')
		.trim()
		.toLowerCase()
		.isEmail()
		.withMessage('Email should be valid!')
		.custom(async value => {
			const user = await User.findOne({ email: value }).exec();

			if (user) throw new Error('Email already in use!');
		})
		.escape(),
	body('password', 'Password should contain at least 8 characters, 1 uppercase, 1 number, 1 symbol')
		.trim()
		.isStrongPassword(),
];

exports.sign_up_post = [
	userValidator,
	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400);
			return res.render('sign-up', { errors: errors.array() });
		}
		const hashedPassword = await bcrypt.hash(req.body.password, 10);
		const user = new User({
			name: req.body.username,
			email: req.body.email,
			password: hashedPassword,
			isMember: false,
			isAdmin: false,
		});
		await user.save();
		req.login(user, err => {
			if (err) return next(err);

			res.redirect('/');
		});
	}),
];

// GET login
exports.log_in_get = asyncHandler(async (req, res, next) => {
	if (req.user) return res.redirect('/');

	res.render('log-in');
});

// GET logout
exports.log_out_get = (req, res, next) => {
	req.logout(err => {
		if (err) return next(err);

		res.redirect('/');
	});
};

// GET membership
exports.membership_get = asyncHandler(async (req, res, next) => {
	if (!req.user || req.user.isMember || req.user.isAdmin) return res.redirect('/');

	res.render('membership', { title: 'Become a Member' });
});

// POST membership
exports.membership_post = [
	body('answer', "You don't deserve...")
		.trim()
		.custom(value => {
			if (!value.toLowerCase() === process.env.MEMBERSHIP_ANSWER) {
				throw new Error("You don't deserve...");
			}
			return true;
		})
		.escape(),
	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400);
			return res.render('membership', { title: 'Become a Member', errors: errors.array() });
		}

		await User.findByIdAndUpdate(req.user.id, { $set: { isMember: true } }).exec();
		res.redirect('/');
	}),
];
