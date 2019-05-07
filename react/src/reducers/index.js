// index.js

import { combineReducers } from 'redux';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import petsReducer from './petsReducer';
import usersReducer from './admin/usersReducer';
import requestsReducer from './admin/requestsReducer';

export default combineReducers({
    errors: errorReducer,
    auth: authReducer,
    pets: petsReducer,
    users: usersReducer,
    requests: requestsReducer
});