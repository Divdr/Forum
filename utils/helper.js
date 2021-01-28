const jwt = require('jsonwebtoken')
const {secretKeys} = require('../config/index')
 /**
  * 
  * @param {*} json convert json object to javascript object 
  */
exports.toObject = (json) => JSON.parse(JSON.stringify(json))

/**
 * 
 * @param {*} obj pass object to generate JWT 
 */
exports.generateJWT = (obj) => jwt.sign(obj,process.env.JWT)

/**
 * 
 * @param {*} string string who's first letter we want as capitalize 
 */
exports.capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1)

exports.removeFields = (obj,keys,defaultFields=true) =>{
    var basicFields = ['createdAt','updatedAt','isDeleted','deletedBy','deletedAt','__v']
    keys = typeof keys == "string" ? [keys] : keys || []
    if(defaultFields) keys = keys.concat(basicFields)
    keys.forEach((key)=>delete obj[key])
    return obj
}