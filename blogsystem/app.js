/**
 * Created by Administrator on 2017/1/13.
 */
var express=require("express");
//连接数据库
var db=require("./models/db.js");
//session
var session = require('express-session');
//路由控制器
var mainController=require("./controller/mainController.js");
var userController=require("./controller/userController.js");
var blogController=require("./controller/blogController.js");

var app=express();

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))
app.set("view engine","ejs");
//静态文件
app.use(express.static("./public"));
//头像静态文件
app.use("/avatar/",express.static("./avatar"));


//登录页面
app.get("/",mainController.showLogin);
//登录操作
app.post("/doLogin",userController.doLogin);
//发表动态
app.post("/publicDynamic",userController.publicDynamic);


//查询用户
app.get("/selectUser",userController.selectUser);
//完善个人资料
app.get("/completeMaterial",userController.completeMaterial);
app.post("/doComplete",userController.doComplete);

//查询动态博客
app.get("/selectBlogs",blogController.selectBlogs);
//查询博客总数量
app.get("/selectBlogCounts",blogController.selectBlogCounts);
//评论博客
app.post("/comment",blogController.comment);
//点赞
app.post("/support",blogController.support);
//删除博客评论
app.post("/deleteComment",blogController.deleteComment);
//回复评论
app.post("/reply",blogController.reply);
//删除回复
app.post("/deleteReply",blogController.deleteReply);


//注册页面
app.get("/register",mainController.showRegister);

//注册操作
app.post("/doRegister",userController.doRegister);
//主页面
app.get("/showMain",mainController.showMain);

//退出登录操作
app.get("/exitLogin",mainController.exitLogin);





app.listen(4000);