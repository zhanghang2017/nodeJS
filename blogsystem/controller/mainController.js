/**
 * Created by Administrator on 2017/1/13.
 */
var UserModel=require("../models/User.js");
//登录页面
exports.showLogin=function(req,res){
    res.render("login");
}
//注册页面
exports.showRegister=function(req,res){
    res.render("register");
}
//主页面
exports.showMain=function(req,res){
    var user=req.session.loginUser;
    var nickName=req.session.loginNickName;
    if(!user){
        res.redirect("/");
        return;
    }

    UserModel.findByAccount(user,function(err,result){
       if(err){
           try{
               throw Error("查找登录用户信息失败");
           }catch(e){
               console.log(e);
               return;
           }
       }
      var avatar=result[0].avatar;
      res.render("main",{nickName:nickName,account:user,avatar:avatar});
    })

}
//退出登录操作
exports.exitLogin=function(req,res){
    //session清除
    req.session.destroy(function(err) {
       if(err){
          try{
             throw Error("清除失败");
          }catch(e){
              console.log(e);
              return;
          }
       }
        else{
           res.redirect("/");
       }
    })
}