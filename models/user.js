const mongoose = require('mongoose')
const bcryptJs = require('bcryptjs')
const APIError = require('../utils/APIError')
const {removeFields} = require('../utils/helper')
const {bcrypt} = require("../config")

const Schema = mongoose.Schema
var ObjectId = mongoose.Schema.Types.ObjectId

const userSchema = new Schema({
    email:      { type:String, required:true},
    password:   { type:String, required:true},
    roles:      [{ type:ObjectId, ref:'role', required:true}],
    isDeleted:  { type:Boolean, default:false},
    deletedBy:  { type:ObjectId, ref:'user', default:null},
    deletedAt:  { type:Date, default:null}
},{
    timestamps:true
})

/**
 * check unique email
 */
userSchema.pre(/^save$/,true, async function(next,done) {
    console.log("________First Save Called______");
    try {
        const record = await mongoose.models['user'].findOne({
            _id:{$ne: this._id},
            email:this.email,
            isDeleted: false
        });
        try {
            record ? done(new APIError({status:422,message:"Email Already Exists"})) : done();
            next()
        } catch (err) {
            done(err)
            console.log(err);
        }
    } catch (err) { 
        console.error(err);
        done(err);next() 
    }
})

/**
 * encrypt password
 */
userSchema.pre(/^save$/,async function(next,done){
    console.log("________Second Save Called______");
    if(!this.isModified('password')) return next()
    const hash = await bcryptJs.hash(this.password,parseInt(bcrypt.salt))
    this.password = hash
    next()
})

/**
 * Delete not required fields
 */
userSchema.methods.deleteFields = function (keys,defaultFields = true) {
    console.log(keys);
    return  removeFields(this.toObject(),keys,defaultFields)
}

/**
 * Password compare
 */
userSchema.methods.isValidPassword = async function (password){
    return await bcryptJs.compare(password,this.password)
}

//mongoose.model(ModelName/referenceName,Schema,TableName)
module.exports = mongoose.model('user',userSchema,'users')
