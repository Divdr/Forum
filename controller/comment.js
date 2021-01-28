const APIError = require('../utils/APIError')
const {removeFields}  = require('../utils/helper')


const COMMENT = require('../models/comment')
const POST = require('../models/post')

/**
 * get all comment by post id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.all = async(req,res,next)=>{
    try {
        const postId = req.params.Id
        const project = "-__v -isDeleted -createdAt -updatedAt -deletedAt -deletedBy -post"
        const comment = await COMMENT.find({postOn:postId,isDeleted:false},project)
            .populate({path:'postedBy',select:'email'})
        return res.sendJson(200,comment)
    } catch (err) {next(err)}
}

/**
 * create comment on particular post
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.store = async(req,res,next)=>{
    try {
        const postId = req.params.Id
        const payload = req.body
        payload.postedBy = req.user._id
        payload.postOn = postId
        const comment = await COMMENT.create(payload)
        await POST.findByIdAndUpdate({_id:postId,isDeleted:false},{$addToSet:{comments:comment._id}})
        return res.sendJson(200,removeFields(comment.toObject(),'user'))
    } catch (err) {next(err)}
}

/**
 * remove particular comment
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.destroy = async(req,res,next)=>{
    const _id = req.params.Id
    const user = req.user._id
    const _query = {_id,isDeleted:false}
    const comment = await Comment.findOne(_query)
    const postUser = await POST.findOne({_id:comment.postOn},'createdBy -_id')
    let isAdmin=false;
    user.roles.forEach(role => {
        if(role.name=="admin")
            isAdmin=true
    });
    if(user.toString() == postUser.createdBy.toString() || user.toString() == comment.user.toString() || isAdmin==true){
        comment.isDeleted = true
        comment.deletedAt = new Date()
        comment.deletedBy = user
        await comment.save()
        return res.sendJson(201,"comment deleted successfully")
    }else{
        throw new APIError({status:403,message:"You don't have access"})
    }
}