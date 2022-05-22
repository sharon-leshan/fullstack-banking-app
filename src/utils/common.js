import store from '../store/store';
import axios from 'axios';
import { BASE_API_URL } from './constants';
import { initiateGetProfile } from '../actions/profile';

export const validateFields = fieldsToValidate => {
	return fieldsToValidate.every(field => Object.values(field)[0] !== '');
};

export const maintainSession = () => {
	const currentPath = window.location.pathname;

	if (currentPath === '/profile') {
		store.dispatch(initiateGetProfile());
	}
};

export const addCSRFToken = async () => {
	try {
		const result = await axios.get(`${BASE_API_URL}/csrf-token`);
		return result.data.csrfToken;
	} catch (error) {
		console.log(error);
	}
};
