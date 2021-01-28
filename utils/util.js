const jwt = require('jsonwebtoken')
const User = require('../models/user')

/**
 * 
 * @param {*} header
 * return userid  
 */
exports.getUser = (header)=>{
    var isAdmin=false
    const authHeader = header.split(' ');
    const decodeAuth=jwt.verify(authHeader[1],process.env.JSON_PRIVATE_KEY)
    const userId = decodeAuth.user
    User.findById(userId)
        .populate('roles')
        .then((result) => {
            console.log(result);
            result.roles.forEach((item)=>{
                if(item.name=="admin")
                    isAdmin=true
            })
            resolve(isAdmin)
        }).catch((err) => {
            reject(err)
        });
    return {
        userId,
        isAdmin
    }
}
