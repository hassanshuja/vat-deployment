import { SET_PETS_LIST, SELECT_PET, PET_EDIT_SHOW, PET_ALL_NOTES } from '../actions/types';
// import isEmpty from '../is-empty';

const initialState = {
  petsList: {},
  selectedPet: null,
  showPet: null,
  petNotes: null
}

export default function (state= initialState, action) {
  switch(action.type) {
    case SET_PETS_LIST:
      return {
          ...state,
          petsList: action.petsList
      }
    case SELECT_PET:
      return {
        ...state,
        selectedPet: action.selectedPet
      }
    case PET_EDIT_SHOW:
      return {
        ...state,
        showPet: action.showPet
      }
    case PET_ALL_NOTES:
      return {
        ...state,
        petNotes: action.petNotes
      }  
    default:
      return state;
  }
}