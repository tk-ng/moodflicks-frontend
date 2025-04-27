import { useState } from "react";

export const useFields = (initialState) => {
	const [formData, setFormData] = useState(initialState);
	const [formErrors, setFormErrors] = useState([]);

	const handleChange = (evt) => {
		setFormData({
			...formData,
			[evt.target.name]: evt.target.value,
		});
		setFormErrors([]);
	};

	const resetFormData = () => {
		setFormData(initialState);
	};
	return [
		formData,
		handleChange,
		resetFormData,
		formErrors,
		setFormErrors,
		setFormData,
	];
};
