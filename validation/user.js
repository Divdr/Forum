const Joi = require("joi");

exports.signup = {
    body :Joi.object({
        email:      Joi.string().required().email({minDomainSegments:2,tlds:['com','net']}).trim().lowercase(),
        password:   Joi.string().required().min(8).trim()
    })
}

exports.login = {
    body :Joi.object({
        email:      Joi.string().required().email({minDomainSegments:2,tlds:['com','net']}).trim().lowercase(),
        password:   Joi.string().required().min(8).trim()
    })
}

exports.makeAdmin = {
    body: Joi.object({
        user: Joi.string().required().regex(/^[0-9a-fA-F](24)$/).trim()
    })
}