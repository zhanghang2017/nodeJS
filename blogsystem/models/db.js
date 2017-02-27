/**
 * Created by Administrator on 2017/1/13.
 */
var mongoose = require('mongoose');    //引用mongoose模块
var db = mongoose.createConnection('localhost','blog'); //创建一个数据库连接
db.on('error',console.error.bind(console,'连接错误:'));
db.once('open',function(){
  console.log("数据库开启");
});
module.exports=db;