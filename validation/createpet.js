const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
    let errors = {};
    data.name = !isEmpty(data.name) ? data.name : '';
    data.type = !isEmpty(data.type) ? data.type : '';
    data.breed = !isEmpty(data.breed) ? data.breed : '';
    data.age = !isEmpty(data.age) ? data.age : '';

    if(Validator.isEmpty(data.name)) {
        errors.name = 'Name field is required';
    }

    if(Validator.isEmpty(data.breed)) {
        errors.breed = 'Breed is required';
    }

    if(Validator.isEmpty(data.age)) {
        errors.age = 'Age is required';
    }

    if(Validator.isEmpty(data.type)) {
        errors.type = 'Type is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}