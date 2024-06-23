const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
	text: { type: String, required: true },
	createdAt: { type: Date, required: true },
	author: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
});

module.exports = mongoose.model('Message', messageSchema);
