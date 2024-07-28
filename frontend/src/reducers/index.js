import { combineReducers } from 'redux';
import accountReducer from "../features/session";

export default combineReducers({
	user: accountReducer,
});