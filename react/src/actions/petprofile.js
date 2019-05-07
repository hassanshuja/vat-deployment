// authentication.js
import axios from 'axios';
import { GET_ERRORS, SET_PETS_LIST, SELECT_PET, PET_EDIT_SHOW, REQUEST_HELP_PENDING, PET_ALL_NOTES } from './types';
// var multer  = require('multer')REQUEST_HELP_PENDING
// var upload = multer({ dest: 'public/uploads' })

/********* CREATE PET PROFILE *********/
export const createPetProfile = (pet, history) => dispatch => {
	axios.post('/api/createpet', pet).then(res => {
		history.push('/pets')
	})
	.catch(err => {
		dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		});
	});
}

/********* UPDATE PET PROFILE *********/
export const updatePetProfile = (pet, history) => dispatch => {
	axios.post('/api/updatepet', pet).then(res => {
		history.push('/pets')
	})
	.catch(err => {
		dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		});
	});
}

/********* DELETE SELECTED PET *********/
export const deleteSelectedPet = (pet, history) => dispatch => {
	axios.post('/api/deletepet', pet).then(res => {
		history.push('/pets')
	})
}

/********* PET REGISTER FOR SELECTED PET *********/
export const registerPetChat = (pet, history) => dispatch => {
	axios.post('/api/registerpetchat', pet).then(res => {
			dispatch({
				type: REQUEST_HELP_PENDING,
				pendingRequestList: res.data
			})
			// history.push('/requesthelp?type=user&session='+ res.data._id)
			history.push('/requesthelp')
			window.location.reload()
		})
		.catch(err => {
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		})
}

/********* GET ALL PETS METHOD *********/
export const getAllPets = (userId, page, history) => dispatch => {
	axios.get('/api/pets', {
		params: {
			user_id: userId,
			page: page
		}
	}).then(res => {
		dispatch(setPetsList(res.data))
	})
}

/********* SET PET FOR CHAT WITH VET / SELECTED PET METHOD *********/
export const setSelectedPet = (pet, history) => dispatch => {
	dispatch(assignSelectedPet(pet))
}

/********* GET PET BY ID METHOD *********/
export const getPetDetails = (petId) => dispatch => {
	axios.get('/api/petshow', {
		params: {
			id: petId
		}
	}).then(res => {
		dispatch(setPetShowById(res.data[0]))
	})
}

/********* GET ALL NOTES BY PET ID METHOD *********/
export const getAllPetNotes = (petId) => dispatch => {
	axios.get('/api/pet/notesall', {
		params: {
			id: petId
		}
	}).then(res => {
		dispatch(setAllPetNotes(res.data._chat))
	})
}

/*******************************************/
/******** DISPATCH METHODS HERE ************/
/*******************************************/

/********  SELECTED PET DISPATCH ********/
export const assignSelectedPet = selectedPet => {
	return {
		type: SELECT_PET,
		selectedPet: selectedPet
	}
}

/********  PETS LIST DISPATCH ********/
export const setPetsList = petsList => {
	return {
		type: SET_PETS_LIST,
		petsList: petsList
	}
}

/********  SELECTED PET SHOW DISPATCH ********/
export const setPetShowById = showPet => {
	return {
		type: PET_EDIT_SHOW,
		showPet: showPet
	}
}

/********  SELECTED PET NOTE DISPATCH ********/
export const setAllPetNotes = petNotes => {
	return {
		type: PET_ALL_NOTES,
		petNotes: petNotes
	}
}