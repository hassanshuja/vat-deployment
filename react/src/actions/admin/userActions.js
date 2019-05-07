import axios from 'axios';
import { GET_ERRORS, GET_ALL_USERS, TOTAL_PAGES, USER_EDIT_SHOW } from '../types';

export const getAllUsers = (page) => dispatch => {
  axios.get('/api/getAllUsers', {
    params: {
      page: page
    }
    })
    .then(res => {
        dispatch(setAllUser(res.data));
    })
    .catch(err => {
      if(err) {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        });
      }
    });
}
/********* UPDATE USER *********/
export const updateUser = (user, history) => dispatch => {
	axios.post('/api/updateuser', user).then(res => {
		history.push('/userlist')
	})
	.catch(err => {
		dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		});
	});
}

/********* GET USER BY ID METHOD *********/
export const getUserDetails = (userId) => dispatch => {
	axios.get('/api/usershow', {
		params: {
			id: userId
		}
	}).then(res => {
		dispatch(setUserShowById(res.data[0]))
	})
}

/********* DELETE SELECTED USER *********/
export const deleteSelectedUser = (user, history) => dispatch => {
	axios.post('/api/deleteuser', user).then(res => {
		history.push('/userlist')
	})
}

/********  SELECTED USER SHOW DISPATCH ********/
export const setUserShowById = showUser => {
	return {
		type: USER_EDIT_SHOW,
		showUser: showUser
	}
}

export const setAllUser = userList => {
   
  return {
      type: GET_ALL_USERS,
      payload:userList
  }
}

export const totalPage = totalpage => {
   
  return {
      type: TOTAL_PAGES,
      payload:totalpage
  }
}