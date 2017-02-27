/**
 * Created by Administrator on 2017/1/13.
 */
var mongoose = require('mongoose');
var db=require("./db.js");
var User=require("./User.js");

//创建博客schema
var BlogSchema = new mongoose.Schema({
    user:{ type:String, ref: 'User' },
    date:{type:Date},
    content:{type:String,require:true},
    comment:[
        {
            _id:{type:String},
            user:{type:String, ref: 'User'},
            body:{type:String},
            date:{type:Date},
            reply:[
                {
                fromUser:{type:String,ref:'User'},
                toUser:{type:String,ref:'User'},
                body:{type:String},
                date:{type:Date}
            }
            ]
        }
    ],
    support:[
        {
            user:{type:String, ref: 'User'}
        }
    ]
});
//查询动态博客静态方法
BlogSchema.statics.findBlog=function(json,limitNum,skipNum,callback){
    return this.find(json).sort({"date":-1}).limit(limitNum).skip(skipNum).populate("user",{"_id":1,"nickName":1,"avatar":1}).populate("support.user",{"_id":1,"nickName":1,"avatar":1}).populate("comment.user",{"_id":1,"nickName":1,"avatar":1}).populate("comment.reply.fromUser",{"_id":1,"nickName":1,"avatar":1}).populate("comment.reply.toUser",{"_id":1,"nickName":1,"avatar":1}).exec(callback);
}
//评论动态微博静态方法
BlogSchema.statics.comment=function(_id,comment,callback){
    return this.update({_id:_id},{$set:{comment:comment}},callback);
}
//点赞
BlogSchema.statics.support=function(_id,support,callback){
   return this.update({_id:_id},{$set:{support:support}},callback);
}


//创建博客集合
var BlogModel = db.model('Blogs', BlogSchema);

module.exports=BlogModel;