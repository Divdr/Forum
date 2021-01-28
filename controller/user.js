const User = require("../models/user");
const Passport = require('passport')
const Role = require("../models/role");
const {toObject,generateJWT,removeFields} = require('../utils/helper')
const APIError = require('../utils/APIError');

/**
 * User Signup
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.signup =  async (req, res, next) => {
    console.log("----------------Signup----------------");
	try {
        const payload = req.body
        const role = await Role.findOne({name:new RegExp('user','i')},'_id')
        if(!role) throw new APIError({message:"Role not generated"})
        payload.roles = role;
        let user = await User.create(payload)
        const body = {_id:user._id,email:user.email}
        const token = generateJWT({user:body})
        user = toObject(user)
        user.token = "Bearer "+token;
        return res.sendJson(200,{data:removeFields(user,['password','roles']),message:"Signup successfully"})
    } 
    catch (err) {
        console.log(err);
        next(err);
    }
}

/**
 * user login
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.login = async(req,res,next)=>{
    console.log("--------login----------");
    Passport.authenticate('login',async(err,user,info)=>{
        try {
            console.log("-----------inside login--------------");
            if(err || !user) throw new APIError({status:401,message: err ? err.message : 'Unauthorized User'})
            req.login(user,{session:false},async(err)=>{
                if(err) throw new APIError();
                const body = {_id:user._id,email:user.email}
                const token = generateJWT({user:body})
                user = toObject(user)
                user.token = "Bearer "+token
                return res.sendJson(200,{data:user,message:info.message})
            })
        } 
        catch (err) {
            console.log(err);
            next(err)
        }
    })(req, res, next);
}

/**
 * Assign admin role to user
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.makeAdmin = async(req,res,next) =>{
    try {
        const payload = req.body
        let adminRoleId = await Role.find({ name: "admin" }).select("_id");
        await User.findByIdAndUpdate(payload, {$addToSet: { roles: adminRoleId}})
        return res.sendJson(201,"Admin Created Successfully")
    } catch (err) {next(err)}
}

