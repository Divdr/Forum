const mongoose = require('mongoose')
var ObjectId = mongoose.Schema.Types.ObjectId;

const commentSchema = new mongoose.Schema({
    comment     :{ type:String, required:true },
    postOn      :{ type:ObjectId, ref:'post', required:true },
    postedBy    :{ type:ObjectId, ref:'user', required:true },
    isDeleted   :{ type:Boolean, default:false },
    deletedBy   :{ type:ObjectId, ref:'user' ,default:null },
    deletedAt   :{ type:Date, default:null }
},{
    timestamps:true
})

module.exports = mongoose.model('comment',commentSchema,'comments')