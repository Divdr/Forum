const passport = require('passport')
const APIError = require('../utils/APIError')
const {capitalize} =  require('../utils/helper')

const handleJWT = (req,res,next,roles) => async(err,user,info)=>{
    try {
        if(err || info || !user){
            const error = err || info.message
            throw new APIError({status:401,message:error ? capitalize(error) : "Unauthorized Access"})
        }
        if(roles != undefined){
            var userRole;
            roles = typeof roles === "string" ? [roles] : roles;
            if(user.roles.length==1){
                userRole = user.roles[0].name
                if(!roles.includes(userRole)){
                    throw new APIError({status:403,message:"You don't have access"})
                }
            }else{
                roles.forEach(role => {
                    if(!roles.includes(role)){
                        throw new APIError({status:403,message:"You don't have access"})
                    }
                });
            }
        }
        req.user = user
        return next()
    } catch (err) {next(err)}
}

exports.isAuth = (roles) =>(req,res,next)=>{
    passport.authenticate('authentication',{session:false},handleJWT(req,res,next,roles))(req,res,next)
}