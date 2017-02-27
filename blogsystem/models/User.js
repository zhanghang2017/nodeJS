/**
 * Created by Administrator on 2017/1/13.
 */
//User model

var mongoose = require('mongoose');
var db=require("./db.js");

//创建用户schema
var UserSchema = new mongoose.Schema({
    _id:{type:String},
    password:{type:String},
    sex:{type:String},
    nickName:{type:String},
    avatar:{type:String,default:"/avatar/defaultAvatar.jpg"}
});

//通过账号判断用户是否存在
UserSchema.statics.findByAccount = function(account, callback) {
    return this.find({ _id: account }, callback);
};


var UserModel = db.model('User', UserSchema);

module.exports=UserModel;