const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user-model');
const Message = require('./models/message-model');

require('dotenv').config();
mongoose.set('strictQuery', false);

const users = [];

// main
(async () => {
	try {
		console.log('DEBUG: Connecting to Database...');
		await mongoose.connect(process.env.MONGO_URI);
		console.log('DEBUG: Populating fake users...');
		await populateUsers();
		console.log('DEBUG: Populating fake messages...');
		await populateMessages();
		console.log('DEBUG: Closing connection to Database...');
		mongoose.connection.close();
	} catch (err) {
		console.log(err);
	}
})();

async function populateUsers() {
	await Promise.all([
		createUser('Alice', 'alice@example.com', 'plsnohackmeD:', false, false),
		createUser('Bob', 'bob@example.com', 'lecoolguy300B)', true, false),
		createUser('Admin', 'admin@example.com', 'ihatemylife;-;', true, true),
	]);

	async function createUser(name, email, plainPassword, isMember, isAdmin) {
		// get hashed and salted password using plain text
		const password = await bcrypt.hash(plainPassword, 10);
		const user = new User({ name, email, password, isMember, isAdmin });
		await user.save();
		users.push(user);
	}
}

async function populateMessages() {
	await Promise.all([
		createMessage('Hiii this is Alice, I am new here :]', Date.now(), users[0]),
		createMessage('HAHHAH peasant you are not a member!!! HAHAAHA', Date.now(), users[1]),
	]);

	async function createMessage(text, createdAt, author) {
		const message = new Message({ text, createdAt, author });
		await message.save();
	}
}
