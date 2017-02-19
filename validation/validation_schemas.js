const registrationSchema = {
	"email": {
		notEmpty: true,
		isEmail:{
			errorMessage: "Invalid Email"
		}
	},
	"password": {
		notEmpty: true,
		isLength:{
			options: [{min:12}],
			errorMessage: "Password must be at least 12 characters"
		},
		matches:{
			options: ["(?=.*[a-zA-Z])(?=.*[0-9]+)(?=.*[!@#$%^&*()_+]+).*","g"],
			errorMessage: "Password must be alphanumeric with some special char:'!@#$%^&*()_+'"
		},
		errorMessage: "Invalid Password"
	},

}

module.exports = registrationSchema;