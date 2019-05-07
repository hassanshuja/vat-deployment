const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
    let errors = {};
    data.problem = !isEmpty(data.problem) ? data.problem : '';
    data.problem_duration = !isEmpty(data.problem_duration) ? data.problem_duration : '';
    data.eating = !isEmpty(data.eating) ? data.eating : '';
    data.weight = !isEmpty(data.weight) ? data.weight : '';

    if(Validator.isEmpty(data.problem)) {
        errors.problem = 'Problem field is required';
    }

    if(Validator.isEmpty(data.eating)) {
        errors.eating = 'Eating is required';
    }

    if(Validator.isEmpty(data.weight)) {
        errors.weight = 'weight is required';
    }

    if(Validator.isEmpty(data.problem_duration)) {
        errors.problem_duration = 'Problem Duration is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}