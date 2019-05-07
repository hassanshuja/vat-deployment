const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PetSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	type: {
		type: String,
		required: true
	},
	breed: {
		type: String,
		required: true
	},
	age: {
		type: String
	},
	image: {
		type: String
	},
	_user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
	},
	_chat: [{
		type: Schema.Types.ObjectId,
		ref: 'chat'
	}]
});

const Pet = mongoose.model('pet', PetSchema );

module.exports = Pet;