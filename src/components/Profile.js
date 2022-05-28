import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Form, Button } from 'react-bootstrap';
import { initiateUpdateProfile } from '../actions/profile';
import { validateFields } from '../utils/common';
import { resetErrors } from '../actions/errors';

const Profile = props => {
	const [state, setState] = useState({
		first_name: '',
		last_name: '',
		email: '',
	});
	const [errorMsg, setErrorMsg] = useState('');
	const [isSubmitted, setIsSubmitted] = useState(false);

	const processOnMount = useCallback(() => {
		const { profile } = props;
		if (!_.isEmpty(profile)) {
			const { first_name, last_name, email } = profile;
			setState({ first_name, last_name, email });
		}
		return () => props.dispatch(resetErrors());
	}, [props]);

	useEffect(() => {
		processOnMount();
	}, [processOnMount]);

	useEffect(() => {
		setState(props.profile);
	}, [props, props.profile]);

	useEffect(() => {
		setErrorMsg(props.errors);
	}, [props.errors]);

	const handleSubmit = e => {
		e.preventDefault();
		const { first_name, last_name } = state;
		const profileData = { first_name, last_name };

		const fieldsToValidate = [{ first_name }, { last_name }];
		const allFieldsEntered = validateFields(fieldsToValidate);

		if (!allFieldsEntered) {
			setErrorMsg({ update_error: 'Please enter all the fields.' });
		} else {
			setIsSubmitted(true);
			setErrorMsg('');
			props.dispatch(initiateUpdateProfile(profileData));
		}
	};

	const handleChange = e => {
		const { name, value } = e.target;
		setState({ ...state, [name]: value });
	};

	return (
		<div className="col-md-6 offset-md-3">
			<Form onSubmit={handleSubmit} className="profile-form">
				{errorMsg && errorMsg.update_error ? (
					<p className="errorMsg centered-message">{errorMsg.update_error}</p>
				) : (
					isSubmitted && (
						<p className="successMsg centered-message">
							Profile updated successfully.
						</p>
					)
				)}
				<Form.Group controlId="email">
					<Form.Label>Email address:</Form.Label>
					<span className="label-value">{state.email || ''}</span>
				</Form.Group>
				<Form.Group controlId="first_name">
					<Form.Label>First name:</Form.Label>
					<Form.Control
						type="text"
						name="first_name"
						placeholder="Enter your first name"
						value={state.first_name || ''}
						onChange={handleChange}
					/>
				</Form.Group>
				<Form.Group controlId="last_name">
					<Form.Label>Last name:</Form.Label>
					<Form.Control
						type="text"
						name="last_name"
						placeholder="Enter your last name"
						value={state.last_name || ''}
						onChange={handleChange}
					/>
				</Form.Group>
				<Button variant="primary" type="submit">
					Submit
				</Button>
			</Form>
		</div>
	);
};

const mapStateToProps = state => ({
	profile: state.profile,
	errors: state.errors,
});
export default connect(mapStateToProps)(Profile);
