const Joi = require('joi')
const APIError = require('../utils/APIError')
const COMMENT = require('../models/comment')

exports.show = {
    params:{
        Id:Joi.string().required().regex(/^[0-9a-fA-F](24)$/)
    }
}

exports.destroy = {
    params:{
        Id:Joi.string().required().regex(/^[0-9a-fA-F](24)$/)
    }
}

exports.create = {
    body:{
        comment:Joi.string().required()
    },
    params:{
        Id:Joi.string().regex(/^[0-9a-fA-F](24)$/)
    }
}