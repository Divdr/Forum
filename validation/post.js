const Joi = require('joi');

const APIError = require('../utils/APIError');

const POST = require('../models/post')

exports.show = {
    params: Joi.object({
        Id: Joi.string().regex(/^[0-9a-fA-F](24)$/).required()
    })
}

exports.create = {
    body:Joi.object({
        title       : Joi.string().required().min(5).trim().replace(/\s\s+/g, ' '),
        description : Joi.string().required().min(20).trim()
    })
}

exports.update = {
    params: Joi.object({
        id : Joi.string().regex(/^[0-9a-fA-F](24)$/).required(),
    }),
    body:Joi.object({
        title       : Joi.string().optional().min(5).trim().replace(/\s\s+/g, ' '),
        description : Joi.string().optional().min(20).trim()
    }).required().not({})
}

exports.destroy = {
    params: Joi.object({
        Id:Joi.string().regex(/^[0-9a-fA-F](24)$/).required()
    })
}

exports.isExists = async (req,res,next) =>{
    try {
        const _id = req.params.Id
        const user = req.user
        const record = await POST.findOne({_id,isDeleted:false})
        if(!record) throw new APIError({status:404,message:"No Record Found"})
        if(JSON.stringify(record.user) !== JSON.stringify(user._id) && user.roles.name === 'user'){
            throw new APIError({status:403,message:"You don't have access"})
        }
        next()
    } catch (err) {next(err)}
}