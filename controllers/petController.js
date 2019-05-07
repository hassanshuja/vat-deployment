const validateProfileInput = require('../validation/createpet');
const validateChatRegisterInput = require('../validation/registerpetchat');
const Pet = require('../models/Pet')
const Chat = require('../models/Chat')
const Busboy = require('busboy')
// var multer  = require('multer')
// var upload = multer({ dest: 'uploads' })
const formidable = require('formidable');
var fs = require('fs');

var checkResponse;

/******************* CREATE PET METHOD *******************/
export const createPet = async (req, res)  => {
	try{
		checkResponse = await validateProfileInput(req.body);
	}catch(error){
		res.json({"error": error})
	}
	const {errors, isValid} = checkResponse
    
	if(!isValid) {
		return res.status(400).json(errors);
	}
	var filename = ''
	if (req.files.image) {
		var oldpath = req.files.image.file
		filename = Date.now() + '-' + req.files.image.filename
		var newpath = '../react/public/images/pets/' + filename
	}
	
	const newPet = new Pet({
		name: req.body.name,
		type: req.body.type,
		age: req.body.age,
		breed: req.body.breed,
		image: filename,
		_user: req.body.user
	});

	newPet.save()
		.then(Pet => {
			res.json(Pet)
			if (req.files.image) {
				fs.createReadStream(oldpath);
				var readerStream = fs.createReadStream(oldpath);
				var writerStream = fs.createWriteStream(newpath);
				readerStream.pipe(writerStream);
			}
		}); 
}

/******************* UPDATE PET METHOD *******************/
export const updatePet = async (req, res)  => {
	try{
		checkResponse = await validateProfileInput(req.body);
	}catch(error){
		res.json({"error": error})
	}
	const {errors, isValid} = checkResponse
    
	if(!isValid) {
		return res.status(400).json(errors);
	}

	Pet.findById(req.body.id, function(err, pet) {
    if (!pet)
			res.status(404).send("data is not found");
		else {
				pet.name = req.body.name;
				pet.breed = req.body.breed;
				pet.age = req.body.age;
				pet.type = req.body.type;
				if(req.files.newImage) {
					/* REMOVE OLD IMAGE */
					if(req.body.image) {
						if(fs.existsSync('../react/public/images/pets/' + req.body.image)) {
							fs.unlinkSync('../react/public/images/pets/' + req.body.image)
						}
					}
					var oldpath = req.files.newImage.file
					/*  UPLOAD NEW IMAGE */
					var filename = Date.now() + '-' + req.files.newImage.filename
					var newpath = '../react/public/images/pets/' + filename
					fs.createReadStream(oldpath);
					var readerStream = fs.createReadStream(oldpath);
					var writerStream = fs.createWriteStream(newpath);
					readerStream.pipe(writerStream);
					/* UPDATE NEW IMAGE FILE */
					pet.image = filename
				}
        pet.save().then(pet => {
          res.json('Update complete');
      })
      .catch(err => {
            res.status(400).send("unable to update the database");
      });
    }
	})
	
}
/********* GET PET BY ID / PET DETAILS BY ID METHOD ********/
export const petById = async (req, res) => {
	var petId = req.query.id
	Pet.find({ _id: petId }).then(Pet => {
		res.json(Pet)
	})
	// return res.json({"something": 'seomthig'});
}

/******************* DELETE PET METHOD *******************/
export const deletePet = async (req, res) => {
	var petId = req.body.id
	var petImage = req.body.image
	Pet.findById(petId, function (err, pet) {
		// GET CHATS DATA AND REMOVE CHATS RELATED TO PET
		var chats = pet._chat
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
		Chat.deleteMany({ _id: { $in: chats}}, (err, chats) => {})
		// REMOVE PET
		pet.remove().then(pet => {
			if (petImage) {
				if(fs.existsSync('../react/public/images/pets/' + petImage)) {
					fs.unlinkSync('../react/public/images/pets/' + petImage)
				}
			}
			res.json(pet)
		})
	})
	// Pet.remove({ _id: petId}).then(pet => {
	// 	if (petImage) {
	// 		fs.unlinkSync('../react/public/images/pets/' + petImage)
	// 	}
	// 	res.json(pet)
	// })
}

/******************* SHOW ALL PETS METHOD *******************/
export const allPets = async (req, res) => {
		var userId = req.query.user_id
		var perPage = 5
    var page = req.query.page || 1
		Pet
			.find({ _user: userId })
			.skip((perPage * page) - perPage)
			.limit(perPage)
			.populate('_chat')
			.exec(function (err, pet) {
				Pet.find({ _user: userId }).count().exec(function(err, count){
					if (err) return handleError(err);
					res.json({
						pets: pet,
						current: page,
						pages: Math.ceil(count / perPage),
						count: count
					})
					// res.json(pet)
				})
		})
		// return res.json({"something": 'seomthig'});
}

/******************* REGISTER PET FOR CHAT WITH VET METHOD *******************/
export const registerPetChat = async (req, res)  => {
	/********** Check if Direct Chat Installing **********/
	if(req.body.chat_direct) {
		const newChat = new Chat({
			_pet: req.body.pet
		});
	
		newChat.save()
			.then(Chat => {
				/********** PUSH INTO PET ChATS ARRAY **********/
				Pet.findById(req.body.pet, function(err, pet) {
					if (!pet)
						res.status(404).send("data is not found");
					else {
						pet._chat.push(Chat);
						pet.save().then(pet => {
							res.json(Chat)
						})
						.catch(err => {
							res.status(400).send("unable to update the database");
						});
					}
				})
			})
	} else {
		// try{
		// 	checkResponse = await validateChatRegisterInput(req.body);
		// }catch(error){
		// 	res.json({"error": error})
		// }
		
		// const {errors, isValid} = checkResponse
		// if(!isValid) {
		// 	return res.status(400).json(errors);
		// }
		// upload.single(image)
	
		if (req.body.images) {
			var Images = JSON.parse(req.body.images)
			Images.map((image, index) => {
				var filename = Date.now() + '-' + image.path
				filename = filename.replace(/\s+/g, '-').toLowerCase();
				var newpath = '../react/public/images/chats/' + filename
				var img = image.buffer
				var data = img.replace(/^data:image\/\w+;base64,/, "");
				var buf = Buffer.from(data, 'base64');
				fs.writeFile(newpath, buf, 'base64', function (err) {});
				image.name = filename
				delete(image.path);
				delete(image.preview);
				delete(image.buffer);
			})
		}	
	
		req.body.images = Images	
		
		var videoname = ''
		if (req.files.videos) {
			var oldpath = req.files.videos.file
			videoname = Date.now() + '-' + req.files.videos.filename
			videoname = videoname.replace(/\s+/g, '-').toLowerCase();
			var newpath = '../react/public/images/chats/' + videoname
			fs.createReadStream(oldpath);
			var readerStream = fs.createReadStream(oldpath);
			var writerStream = fs.createWriteStream(newpath);
			readerStream.pipe(writerStream);
		}	
	
		const newChat = new Chat({
			problem: req.body.problem,
			problem_duration: req.body.problem_duration,
			eating: req.body.eating,
			weight: req.body.weight,
			images: req.body.images,
			videos: videoname,
			_pet: req.body.pet
		});
	
		newChat.save()
			.then(Chat => {
				/********** PUSH INTO PET ChATS ARRAY **********/
				Pet.findById(req.body.pet, function(err, pet) {
					if (!pet)
						res.status(404).send("data is not found");
					else {
						pet._chat.push(Chat);
						pet.save().then(pet => {
							res.json(Chat)
						})
						.catch(err => {
							res.status(400).send("unable to update the database");
						});
					}
				})
			})
	}
}

/******************* GET PETS NOTES METHOD *******************/
export const petNotes = async (req, res) => {
	var petId = req.query.id
	Pet.findById(petId).populate('_chat').then(pet => {
		res.json(pet)
	}).catch(err => {
		res.status(400).send("Bad Request");
	});
}
