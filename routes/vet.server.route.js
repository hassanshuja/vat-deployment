// ./express-server/routes/todo.server.route.js
import express from 'express';
//import controller file
import passport from 'passport';
// import * as todoController from '../controllers/vet.server.controller';
import * as UserController from '../controllers/userController';
import * as RequestController from '../controllers/requestController';
import * as PetController from '../controllers/petController';
// get an instance of express router

const router = express.Router();
// router.route('/')
//      .get(todoController.getTodos)
//      .post(todoController.addTodo)
//      .put(todoController.updateTodo);
// router.route('/:id')
//       .get(todoController.getTodo)
//       .delete(todoController.deleteTodo);
router.route('/pusher/auth').post(UserController.requestHelp);
router.route('/register').post(UserController.register);
router.route('/login').post(UserController.login);
router.route('/me').get(passport.authenticate('jwt', { session: false }), UserController.me);

/************* PET ROUTES *************/
router.route('/createpet').post(PetController.createPet);
router.route('/pets').get(PetController.allPets);
router.route('/registerpetchat').post(PetController.registerPetChat);
router.route('/deletepet').post(PetController.deletePet);
router.route('/pet/notesall').get(PetController.petNotes);

// router.route('/pet:id').get(PetController.editPet)
/*********** ADMIN ROUTES ***********/
router.route('/getAllusers').get(UserController.getAllUsers);
router.route('/getAllrequests').get(RequestController.getAllRequests);
router.route('/updateRequestStatus').post(RequestController.updateRequestStatus);
router.route('/getRequestById').get(RequestController.getRequestById);
router.route('/uploadNotes').post(RequestController.uploadNotes);
router.route('/usershow').get(UserController.userById)
router.route('/updateuser').post(UserController.updateUser);
router.route('/deleteuser').post(UserController.deleteUser);
/*********** ADMIN ROUTES ***********/

router.route('/petshow').get(PetController.petById)
router.route('/updatepet').post(PetController.updatePet);
/************* PET ROUTES *************/

export default router;