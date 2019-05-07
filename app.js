// ./express-server/app.js
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import bb from 'express-busboy';
import SourceMapSupport from 'source-map-support';
// import routes
import vetRoutes from './routes/vet.server.route';
// import Users from './routes/user';
import config from './models/vet.server.model';
// define our app using express
const app = express();
// const Pusher = require('pusher');

// express-busboy to parse multipart/form-data
bb.extend(app, {
  upload: true,
  // path: './uploads123/files'
  }
);
// allow-cors
app.use(function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

// const pusher =  new Pusher({
//   appId: '745676',
//   key: '92e8a4cbd51aaee54132',
//   secret: '60c1fec3508f2681a5da',
//   cluster: 'ap2',
//   encrypted: true
// });
// const channel = 'chats-changes'
// app.use(cors())
// configure app
app.use(logger('dev'));

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static(path.join(__dirname, 'public')));
// set the port
const port = process.env.PORT || 3001;
// connect to database
mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true }).then(
  () => {console.log('Database is connected') },
  err => { console.log('Can not connect to the database'+ err)}
);
// const db = mongoose.connection;
// db.once('open', () => {
//   app.listen(9000, () => {
//     console.log('Node server running on port 9000');
//   });

//   const taskCollection = db.collection('chats');
//   const changeStream = taskCollection.watch();
  
//   changeStream.on('change', (change) => {
//     console.log(change)
//     if(change.operationType === 'insert') {
//       const task = change.fullDocument;
//       pusher.trigger(
//         channel,
//         'inserted', 
//         {
//           id: task._id,
//           task: task.task,
//         }
//       ); 
//     } else if(change.operationType === 'delete') {
//       pusher.trigger(
//         channel,
//         'deleted', 
//         change.documentKey._id
//       );
//     }  else if(change.operationType === 'update') {
//       pusher.trigger(
//         channel,
//         'update', 
//         change.documentKey._id
//       );
//     }
//   });
// });
// add Source Map Support
SourceMapSupport.install();

app.use('/api', vetRoutes);
// app.use('/api/user', Users);

app.get('/', (req,res) => {
  return res.end('Api working');
})
// catch 404
app.use((req, res, next) => {
  res.status(404).send('<h2 align=center>Page Not Found!</h2>');
});
// start the server
app.listen(port,() => {
  console.log(`App Server Listening at http://localhost:${port}`);
});