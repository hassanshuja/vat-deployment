import { GET_ALL_USERS, TOTAL_PAGES, USER_EDIT_SHOW } from '../../actions/types';
// import isEmpty from '../is-empty';

const initialState = {
  userList: [],
  totalpage: null,
  showUser: null
}

export default function (state= initialState, action) {
  switch(action.type) {
    case GET_ALL_USERS:
      return {
          ...state,
          userList: action.payload
      }
    case TOTAL_PAGES:
      return {
        ...state,
        totalpage: action.payload
      }
    case USER_EDIT_SHOW:
      return {
        ...state,
        showUser: action.showUser
      }
    default:
      return state;
  }
}