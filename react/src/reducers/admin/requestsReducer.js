import { GET_ALL_REQUESTS, TOTAL_PAGES, REQUEST_HELP_PENDING, GET_REQUEST_DETAILS, ACCEPTED_CALL_ADMIN } from '../../actions/types';
// import isEmpty from '../../is-empty';

const initialState = {
  requestList: [],
  pendingRequestList: [],
  totalpage: null,
  requestDetails: null,
  userOnCall: null
}

export default function (state= initialState, action) {
  switch(action.type) {
    case GET_ALL_REQUESTS:
      return {
          ...state,
          requestList: action.payload
      }
    case REQUEST_HELP_PENDING:
      return {
          ...state,
          pendingRequestList: state.pendingRequestList.concat(action.pendingRequestList)
      }
    case GET_REQUEST_DETAILS:
      return {
        ...state,
        requestDetails: action.payload
      }  
    case TOTAL_PAGES:
      return {
        ...state,
        totalpage: action.payload
      }
    case ACCEPTED_CALL_ADMIN:
      return {
        ...state,
        userOnCall: action.userId
      }
    default:
      return state;
  }
}