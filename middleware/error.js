const { ValidationError } = require('express-validation')
const APIError = require('../utils/APIError')

/**
 * Get Validation error message
 * @param {*} error 
 */
const getErrorMessages = (error) =>{
    error = error.details;
    if (error.params)     return error.params[0].message;
    else if (error.query) return error.query[0].message;
    else if (error.body)  return error.body[0].message;
}

/**
 * Error Handler. Send stacktrace only during developement
 * @param {*} err 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.handler = (err,req,res,next)=>{
    let message = err.message || "something went wrong! Please try again later"
    if(!err.isPublic){
        err.status = 500
        message = "Something went wrong"
    }
    console.log(process.env.NODE_ENV);
    if(process.env.NODE_ENV == 'development'){
        if(err.stack) console.log(err.stack);
        if(err.errors) console.log(err.errors);
    }
    return res.sendJson(err.status,message)
}

/**
 * if error is not an istance of APIError,convert it
 * @param {*} err 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.converter = (err,req,res,next)=>{
    let convertedError = err
    if(err instanceof ValidationError){
        console.log("inside validation error "+err);
        convertedError = new APIError({status:422,message:getErrorMessages(err)})
    }else if(!(err instanceof APIError)){
        convertedError = new APIError({status:err.status,message:err.message,stack:err.stack})
    }
    return this.handler(convertedError,req,res)
}

/**
 * catch 404 error
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.notFound = (req,res,next) =>{
    const err = new APIError({message:"Not Found",status:404})
    return this.handler(err,req,res)
}