const mongoose = require('mongoose')
var ObjectId = mongoose.Schema.Types.ObjectId

const postSchema = new mongoose.Schema({
    title       : { type:String, required:true },
    description : { type:String, required:true },
    createdBy   : { type:ObjectId, ref:'user', required:true },
    comments    : [{ type:ObjectId, ref:'comment',require:true,default:null}],
    isDeleted   : { type:Boolean, default:false },
    deletedBy   : { type:ObjectId, ref:'user', default:null },
    deletedAt   : { type:Date, default:null }
},{
    timestamps:true
})

module.exports = mongoose.model('post',postSchema,'posts')