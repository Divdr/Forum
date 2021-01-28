const {removeFields} = require('../utils/helper')

/**
 * Get All posts
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.all = async(req,res,next)=>{
    try {
        const posts = await POST.find({isDeleted:false},'-__v -isDeleted -createdAt -updatedAt -deletedAt -deletedBy')
        .populate({path:'createdBy',select:'email'})
        .populate({path:'comments', select:'message',populate:{ path:'user', select:'email' }})
        return res.sendJson(200,posts)
    } catch (error) {next(err)}
}

exports.showCustom = async(req,res,next)=>{
    try {
        let _query={isDeleted:false};
        console.log(req.user);
        let userId = req.user._id
        console.log(_query);
        console.log(userId);
        if(req.query.fetch){
            let fetch = req.query.fetch
            if(fetch==="me")
                _query = {createdBy:userId,isDeleted:false}
            else if(fetch==="other")
                _query = {createdBy:{$ne:userId},isDeleted:false}
        }
        const posts = await POST.find(_query,'-__v -isDeleted -createdAt -updatedAt -deletedAt -deletedBy')
        .populate({path:'createdBy',select:'email'})
        .populate({path:'comments',select:"message user"})
        return res.sendJson(200,posts)
    } catch (err) {next(err)}
}

/**
 * Get post by id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.show = async(req,res,next) =>{
    try {
        let _id=req.params.Id
        console.log(_id);
        const post = await POST.findOne({_id,isDeleted:false})
        .populate({path:'createdBy',select:'email'})
        .populate({path:'comments', select:'message',populate:{path:'user',select:'email'}})
        return res.sendJson(200,post)
    } catch (err) {next(err)}
}

/**
 * Create new post
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.store = async (req,res,next) =>{
    try {
        const payload = req.body
        payload.createdBy = req.user._id
        const post = await POST.create(payload)
        return res.sendJson(200,removeFields(post.toObject()),['user','comments']);
    } catch (err) {next(err)}
}

/**
 * update post by id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.update = async(req,res,next) =>{
    try {
        const _id = req.params.Id
        const payload = req.body
        const _query = {_id,isDeleted:false}
        const post = await POST.findByIdAndUpdate(_query,{$set:payload},{new:true})
        return res.sendJson(200,removeFields(post.toObject()),['user','comments'])
    } catch (err) {next(err)}
}

/**
 * delete post by id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.destroy = async(req,res,next)=>{
    try {
        const _id = req.params.Id
        const userId = req.user._id
        const _query = {_id,isDeleted:false}
        const _delete = {$set:{isDeleted:true,deletedAt:new Date(),deletedBy:userId}}
        await POST.findOneAndUpdate(_query,_delete)
        return res.sendJson(200,"Post deleted successfully")
    } catch (err) {next(err)}
}

const POST = require('../models/post')