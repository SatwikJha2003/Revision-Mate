import { combineReducers } from 'redux';
import accountReducer from "../features/manageAccount";

export default combineReducers({
	user: accountReducer,
});