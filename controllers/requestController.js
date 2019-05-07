const Chat = require('../models/Chat')

var pageNo = 1
var size = 10
var query = {}
var response = {}

var checkResponse;

export const getAllRequests = (req, res) => {
  pageNo = parseInt(req.query.pageNo) ? parseInt(req.query.pageNo) : pageNo
  size = parseInt(req.query.size) ? parseInt(req.query.size) : size
  query = {}
  response = {}

  if(pageNo < 0 || pageNo === 0) {
    response = {"error" : true,"message" : "invalid page number, should start with 1"};
    return res.json(response)
  }
  query.skip = size * (pageNo - 1)
  query.limit = size
  // Find some documents
  Chat.countDocuments({},function(err,totalCount) {
    if(err) {
      response = {"error" : true, "message" : "Error fetching data"}
    }
    var query = Chat.find({status: 'pending'}).populate({path: '_pet', populate: { path: '_user'}});
    query.exec(function (err, data) {
      // Mongo command to fetch all data from collection.
      if(err) {
        response = {"error" : true, "message" : "Error fetching data"};
      } else {
        var totalPages = Math.ceil(totalCount / size)
        response = {"error" : false, "message" : data,"pages": totalPages};
      }
      res.json(response);
    })
  })
}

export const updateRequestStatus = (req,res) => {
  Chat.findById(req.body.id, function(err, chat) {
    if (!chat)
			res.status(404).send("data is not found");
		else {
				chat.status = req.body.status;
        chat.save().then(pet => {
          res.json('Update complete');
      })
      .catch(err => {
            res.status(400).send("unable to update the database");
      });
    }
	})
}

export const getRequestById = (req,res) => {
  var query = Chat.findById(req.query.id).populate({path: '_pet', populate: { path: '_user'}});
  query.exec(function (err, chat) {
    if (!chat)
			res.status(404).send("data is not found");
		else {
      res.json(chat);
    }
	})
}

export const uploadNotes = (req,res) => {
  Chat.findById(req.body.id, function(err, chat) {
    if (!chat)
			res.status(404).send("data is not found");
		else {
				chat.notes = req.body.notes;
        chat.save().then(pet => {
          res.json('Update complete');
      })
      .catch(err => {
            res.status(400).send("unable to update the database");
      });
    }
	})
}