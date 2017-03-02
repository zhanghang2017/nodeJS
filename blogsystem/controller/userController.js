/**
 * Created by Administrator on 2017/1/13.
 */
var formidable=require("formidable");
var path=require("path");
var fs=require("fs");
var md5=require("../models/md5.js");
var BlogModel=require("../models/Blog.js");
var UserModel=require("../models/User.js");

//登录操作
exports.doLogin=function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        var user=fields;
        var md5Password=md5.md5(user.password);

        UserModel.findByAccount(user.account,function(err,result){
           if(err){
               try{
                   throw Error("登录失败，服务器错误");
               }catch(e){
                   console.log(e);
                   res.send("-2");
               }
               return;
           }
          if(result.length===0){
              res.send("0");
          }else{
              var _user=result[0];
              if(md5Password==_user.password){
                 req.session.loginUser=_user._id;
                 req.session.loginNickName=_user.nickName;
                 res.send("1");
                  return;
              }else{
                  res.send("-1");
                  return;
              }
          }
       });
    });

}
//注册操作
exports.doRegister=function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        var user=fields;
        user._id=user.account;
        if(user.nickName==""){
            user.nickName=user.account;
        }
        //MD5加密
        user.password=md5.md5(user.password);
        UserModel.findByAccount(user.account,function(err,result){
         if(err){
             try{
                 throw Error("注册失败");
             }catch(e){
                 console.log(e);
                 res.send("0");
             }
             return;
         }
         if(result.length===0){
             //存储数据库
             UserModel.create(user,function(err){
                 if(err){
                     try{
                         throw Error("注册失败");
                     }catch(e){
                         console.log(e);
                     }
                     return;
                 }
                 res.send("1");
             });
         }else{
             res.send("-1");
         }
        });


    });

}
//发布动态
exports.publicDynamic=function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
      if(err){
          try{
              throw Error("发布失败")
          }catch(e){
               console.log(e);
              res.send("-1");
          }
        return;
      }
   var blog=fields;
       blog.date=new Date();
       blog.user=blog.userAccount;
       BlogModel.create(blog,function(err){
            if(err){
                try{
                    throw Error("发布失败")
                }catch(e){
                    console.log(e);
                    res.send("0");
                }
                return;
            }
            res.send("1");
        });
    });
}
//完善个人资料页面
exports.completeMaterial=function(req,res){
 if(!req.session.loginUser){
     res.redirect("/");
     return;
 }
    res.render("completeMaterial",{
        account:req.session.loginUser,
        nickName:req.session.loginNickName
    });
}
//查询用户
exports.selectUser=function(req,res){
    if(!req.session.loginUser){
        res.redirect("/");
        return;
    };

    var user={};
    if(req.query.userAccount){
     var userAccount=req.query.userAccount;
     user._id=userAccount;
    }
    UserModel.find(user, function(err,result){
       if(err){
           try{
               throw Error("查询失败");
           }catch(e){
               console.log(e);
               return;
           }
       }
        res.send(result);


    })

};

//完善个人资料操作
exports.doComplete=function(req,res){
    if(!req.session.loginUser){
        res.redirect("/");
        return;
    }
    var form = new formidable.IncomingForm();
    var _path=path.normalize(__dirname+"/../avatar/")
    form.uploadDir =_path;
    form.parse(req, function(err, fields,files) {
        if(err){
                try{
                    throw Error("提交失败")
                }catch(e){
                    console.log(e);
                    return;
                }
        }
        var account=fields.account;
        var findUserJSON={
            _id:account
        }
        var updateJSON={
            nickName:fields.nickName
        }

        if(files.avatar.size==0){
            fs.unlink(files.avatar.path,function(err){
                UserModel.update(findUserJSON,{$set:updateJSON},function(err){
                    if(err){
                        try{
                            throw Error("完善失败");
                        }catch(e){
                            console.log(e);
                            return;
                        }
                    }
                    req.session.loginNickName=updateJSON.nickName;
                    res.redirect("/showMain");
                });
            });


        }else{
            var oldPath=files.avatar.path;
            var newPath=path.normalize(__dirname+"/../avatar/"+account+".jpg");
            fs.rename(oldPath,newPath,function(err){
                if(err){
                    try{
                        throw Error("图片更名失败");
                    }catch(e){
                        console.log(e);
                        return;
                    }
                }
                updateJSON.avatar="/avatar/"+account+".jpg";
                UserModel.update(findUserJSON,{$set:updateJSON},function(err){
                    if(err){
                        try{
                            throw Error("完善失败");
                        }catch(e){
                            console.log(e);
                            return;
                        }
                    }
                    res.redirect("/showMain");
                });
            })
        }


    });
}