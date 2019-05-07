import router from '../routes/vet.server.route';

const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');
const validateUserUpdateInput = require('../validation/userupdate');
const User = require('../models/User')
const Pet = require('../models/Pet')
const Chat = require('../models/Chat')
const Pusher = require('pusher');
var fs = require('fs');

var pageNo = 1
var size = 10
var query = {}
var response = {}

var checkResponse;
export const register = async (req, res)  => {
	try{
		checkResponse = await validateRegisterInput(req.body);
	}catch(error){
		res.json({"error": error})
	}
	const {errors, isValid} = checkResponse
	var role = null;

	if(!isValid) {
		console.log('coming')
		return res.status(400).json(errors);
	}
    
    User.findOne({
			email: req.body.email
    }).then(user => {
			if(user) {
				return res.status(400).json({
					email: 'Email already exists'
				});
			}
			else {
				const avatar = gravatar.url(req.body.email, {
					s: '200',
					r: 'pg',
					d: 'mm'
				});
				if(req.body.roles == 'admin'){
					role = 'admin';
				}else{
					role = 'user';
				}
				const newUser = new User({
					name: req.body.name,
					email: req.body.email,
					password: req.body.password,
					role: role,
					avatar
				});
				
				bcrypt.genSalt(10, (err, salt) => {
					if(err) console.error('There was an error', err);
					else {
						bcrypt.hash(newUser.password, salt, (err, hash) => {
							if(err) console.error('There was an error', err);
							else {
								newUser.password = hash;
								newUser
								.save()
								.then(user => {
									res.json(user)
								}); 
							}
						});
					}
				});
			}
    }).catch( error => {
			console.error( 'onRejected function called: ' + error );
		})
}


export const  login = (req, res) => {
	const { errors, isValid } = validateLoginInput(req.body);
	if(!isValid) {
		return res.status(400).json(errors);
	}

	const email = req.body.email;
	const password = req.body.password;

	User.findOne({email})
	.then(user => {
		if(!user) {
			errors.email = 'User not found'
			return res.status(404).json(errors);
		}
		bcrypt.compare(password, user.password)
		.then(isMatch => {
			if(isMatch) {
				const payload = {
					id: user.id,
					name: user.name,
					role: user.role,
					avatar: user.avatar
				}
				jwt.sign(payload, 'secret', {
						expiresIn: 3600
				}, (err, token) => {
					if(err) console.error('There is some error in token', err);
					else {
						res.json({
							success: true,
							token: `Bearer ${token}`
						});
					}
				});
			}
			else {
				errors.password = 'Incorrect Password';
				return res.status(400).json(errors);
			}
		});
	});
}

export const requestHelp = (req, res) => {
	let socket_id = req.body.socket_id
	let channelName = req.body.channel_name
	// let name = req.body.user_name
	let user_id = req.body.user_id

	var pusher = new Pusher({
		appId: '745676',
		key: '92e8a4cbd51aaee54132',
		secret: '60c1fec3508f2681a5da',
		cluster: 'ap2',
		encrypted: true
	});


	var presence_data = {user_id: user_id}

	let key = pusher.authenticate(socket_id, channelName, presence_data)
	
	res.json(key)
}

// passport.authenticate('jwt', { session: false }),
export const me = (req, res) => {
	return res.json({
		id: req.user.id,
		name: req.user.name,
		email: req.user.email
	});
}

export const getAllUsers = (req, res) => {
	var perPage = 15
	var page = req.query.page || 1
	User
		.find()
		.skip((perPage * page) - perPage)
		.limit(perPage)
		.exec(function (err, user) {
			User.find().count().exec(function(err, count){
				if (err) return handleError(err);
				res.json({
					users: user,
					current: page,
					pages: Math.ceil(count / perPage),
					count: count
				})
			})
		})
}

/******************* UPDATE USER METHOD *******************/
export const updateUser = async (req, res)  => {
	// console.log(req.body)
	// return false
	try{
		checkResponse = await validateUserUpdateInput(req.body);
	}catch(error){
		res.json({"error": error})
	}
	const {errors, isValid} = checkResponse
    
	if(!isValid) {
		return res.status(400).json(errors);
	}
	console.log(req.body)
	const toUpdate = {
		_id: req.body.id,
		name: req.body.name,
		email: req.body.email
	};

	User.findById(req.body.id, function(err, user) {
    if (!user)
		res.status(404).send("data is not found");
	else {
		user.name = req.body.name;
		user.email = req.body.email;
		if(req.body.password && req.body.password !== 'null') {
			bcrypt.genSalt(10, (err, salt) => {
				if(err) console.error('There was an error', err);
				else {
					bcrypt.hash(user.password, salt, (err, hash) => {
						if(err) console.error('There was an error', err);
						else {
							user.password = hash;
						}
					});
				}
			});
		}
		user.save().then(user => {
			res.json('Update complete');
		})
		.catch(err => {
			res.status(400).send("unable to update the database");
		});
    }
	})
	
}

/********* GET USER BY ID / USER DETAILS BY ID METHOD ********/
export const userById = async (req, res) => {
	var userId = req.query.id
	User.find({ _id: userId }, 'name email').then(User => {
		res.json(User)
	})
}

/******************* DELETE USER METHOD *******************/
export const deleteUser = async (req, res) => {
	var userId = req.body.id
	User.findById(userId, function (err, user) {
		Pet.find({ _user: userId}).then(pet => {
			pet.map(data => {
				var petId = data._id
				Pet.findById(petId, function (err, pet2) {
					// GET CHATS DATA AND REMOVE CHATS RELATED TO PET
					var chats = pet2._chat
					Chat.find({ _id: { $in: chats}}, function(err, res) {
						res.map(data => {
							if(data.images && data.images.length > 0) {
								data.images.map(image => {
									if(fs.existsSync('../react/public/images/chats/' + image.name)) {
										fs.unlinkSync('../react/public/images/chats/' + image.name)
									}
								})
							}
							if(data.videos && data.videos.length > 0) {
								data.videos.map(video => {
									if(fs.existsSync('../react/public/images/chats/' + video)) {
										fs.unlinkSync('../react/public/images/chats/' + video)
									}
								})
							}
						})
					})
					Chat.deleteMany({ _id: { $in: chats}}, (err, chatt) => {})
					if(pet2.image) {
						if(fs.existsSync('../react/public/images/pets/' + pet2.image)) {
							fs.unlinkSync('../react/public/images/pets/' + pet2.image)
						}
					}
					// REMOVE PET
					pet2.remove()
				})
			})
		})
	})
	User.remove({ _id: userId}).then(user => {
		res.json(user)
	})
}

// router.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
//     return res.json({
//         id: req.user.id,
//         name: req.user.name,
//         email: req.user.email
//     });
// });