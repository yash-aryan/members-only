const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/user-model.js');

// GET signup
exports.sign_up_get = asyncHandler(async (req, res, next) => {
	res.render('sign-up', { locals: {} });
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
			const locals = { errors: errors.array() };
			res.status(400);
			return res.render('sign-up', { locals });
		}
		const password = bcrypt.hashSync(req.body.password, 10);
		const user = new User({
			name: req.body.username,
			email: req.body.email,
			password,
			isMember: false,
			isAdmin: false,
		});
		await user.save();
		res.redirect('/');
	}),
];

// GET login
exports.log_in_get = asyncHandler(async (req, res, next) => {
	res.render('log-in', { locals: {} });
});

// GET logout
exports.log_out_get = (req, res, next) => {
	req.logout(err => {
		if (err) return next(err);

		res.redirect('/');
	});
};
