const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const User = require('../models/user-model.js');
const Message = require('../models/message-model.js');

exports.index_get = asyncHandler(async (req, res, next) => {
	const messages = await Message.find({}).populate('author').exec();
	res.render('index', { title: 'Secret Club', user: req.user, messages });
});

const messageValidator = [
	body('message')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Message cannot be empty!')
		.isLength({ max: 1500 })
		.withMessage('Message is over 1500 characters!')
		.escape(),
];
exports.index_post = [
	messageValidator,
	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			const messages = await Message.find({}).populate('author').exec();
			res.status(400);
			res.render('index', {
				locals: { title: 'Secret Club', user: req.user, messages, errors: errors.array() },
			});
			return;
		}

		const message = new Message({
			text: req.body.message,
			createdAt: Date.now(),
			author: req.user.id,
		});

		message.save();
		res.redirect('/');
	}),
];
