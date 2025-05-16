const Joi = require("joi");
const dns = require('dns');

const userCreateDTO = Joi.object({
    name : Joi.string().regex(/^[A-Z][a-z]+(?: [A-Z][a-z]+)+$/i).min(2).max(50).required(),
    email : Joi.string().email().required().messages({
        "string.email" : "Email must have a valid format"
    }),
    address :Joi.string().optional(),
    phone : Joi.string().min(10).max(15).optional(),
    password : Joi.string().regex(/^(?=.*[\d])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,25}$/).required().messages({
        "string.pattern.base" : "password must contain small letter, capital letter, number and special character"
    }),
    confirmPassword : Joi.string().equal(Joi.ref('password')).required().messages({
        "any.only" : "password and confirm password should match"
    }),
 
    image :Joi.string(),
    role : Joi.string().regex(/^(seller|customer)$/).required().messages({
        "string.pattern.base" : "Role should be seller or customer"
    }),
    storeName : Joi.string(),
    storeAddress : Joi.string(),
    panNumber : Joi.string().regex(/^\d{9}$/).messages({
        "string.pattern.base" : "PAN number format is invalid"
    }),
})

PasswordUpdateDTO = Joi.object({
    password : Joi.string().regex(/^(?=.*[\d])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,25}$/).required().messages({
        "string.pattern.base" : "password must contain small letter, capital letter, number and special character"
    }),
    confirmPassword : Joi.string().equal(Joi.ref('password')).required().messages({
        "any.only" : "password and confirm password should match"
    }),
})

module.exports = {
    userCreateDTO,
    PasswordUpdateDTO
}