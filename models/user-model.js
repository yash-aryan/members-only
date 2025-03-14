const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	isMember: { type: Boolean, required: true },
	isAdmin: { type: Boolean, required: true },
});

module.exports = mongoose.model('User', userSchema);
