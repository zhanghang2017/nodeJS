/**
 * Created by Administrator on 2017/1/13.
 */
var BlogModel=require("../models/Blog.js");
var formidable=require("formidable");

//查询动态博客
exports.selectBlogs=function(req,res){
    var json={};
    if(req.query.account){
        json.user=req.query.account;
    }
    var limitNum=parseInt(req.query.limitNum)||2;
    var pageCurrent=parseInt(req.query.pageCurrent-1)||0;
    var skipNum=pageCurrent*limitNum;

    BlogModel.findBlog(json,limitNum,skipNum,function(err,result){
        res.json(result);
    });
}
//查询总的动态博客数量
exports.selectBlogCounts=function(req,res){
    var json={};
    json.user=req.query.account;
    BlogModel.count(json, function(err,count){
        if(err){
            try{
                throw Error("服务器错误")
            }catch(e){
                console.log(e);
                res.send("-1");
                return;
            }
        }
        res.send(count.toString());

    });
}
//评论博客
exports.comment=function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        if(err){
         try{
             throw Error("服务器错误")
         }catch(e){
             console.log(e);
             res.send("0");
             return;
         }
        }
         var comment=fields;
         comment.date=new Date();
        comment._id=(new Date()).getTime().toString()+fields.user;
         var findId={
             _id:fields.blog_id
           }
        BlogModel.findOne(findId,function(err,result){
              if(err){
                 try{
                     throw Error("查找博客失败");
                 }catch(e){
                     console.log(e);
                     res.send("0");
                     return;
                 }
              }
            var blog=result;
            var comments=result.comment;
            comments.push(comment);
            BlogModel.comment(blog._id,comments,function(err,result){
                if(err){
                    try{
                        throw Error("评论失败");
                    }catch(e){
                        consoel.log(e);
                        res.send("-1");
                        return;
                    }
                }
                res.send("1");
            });
        });

    });
}
//点赞
exports.support=function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        if(err){
            try{
                throw Error("请求错误");
            }catch(e){
                console.log(e);
                res.send("0");
                return;
            }
        }
            var findJSON={
                _id:fields.articleId
            }
            var user={
                user:fields.userAccount
            }
            BlogModel.findOne(findJSON,function(err,result){
               if(err){
                   try{
                      throw Error("查询博客失败");
                   }catch(e){
                      console.log(e);
                       res.send("-1");
                       return;
                   }
                 }
                var flag=true;
                var support=result.support;
                for(var i=0;i<support.length;i++){
                    var item=support[i];
                    if(item.user===user.user){
                        flag=false;
                    }
                }
                 if(flag){
                     support.push(user);
                     BlogModel.support(findJSON._id,support,function(err,result){
                         if(err){
                             try{
                                 throw Error("点赞失败");
                             }catch(e){
                                 console.log(e);
                                 res.send("-3");
                                 return;
                             }
                         }
                         res.send("1");
                     });

                 }else{
                     res.send("-2");
                 }
            })
    })
}
//删除评论
exports.deleteComment=function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
      if(err){
         try{
             throw Error("提交请求失败");
         }catch(e){
             console.log(e);
             res.send("0");
             return;
         }
      }
   var comment_id=fields.comment_id;
   var blog_id=fields.blog_id;
   BlogModel.findOne({_id:blog_id},function(err,result){
     if(err){
         try{
            throw Error(err);
         }catch(e){
             console.log(e);
             res.send("-1");
            return;
         }
     }
     var comments=result.comment;

      for(var i=0;i<comments.length;i++){
          var  comment_item=comments[i];
          if(comment_item._id==comment_id){
              comments.splice(i,1);
          }
      }
    BlogModel.update({_id:blog_id},{$set:{comment:comments}},function(err){
         if(err){
             try{
                 throw Error(err);
             }catch(e){
                 console.log(e);
                 res.send("-1");
                 return;
             }
         }
         res.send("1");



       })


   })




    });
}
//回复评论
exports.reply=function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
         if(err){
            try{
                 throw  Error(err);
            }catch(e){
                console.log(e);
                res.send("0");
                return;
            }
         }
       var jsonData={
           fromUser:fields.fromUser,
           toUser:fields.toUser,
           body:fields.body,
           date:new Date()
       }
       BlogModel.findOne({_id:fields.blog_id},function(err,result){
           if(err){
               try{
                   throw Error(err)
               }catch(e){
                   console.log(e);
                   res.send("-1");
                   return;
               }
           }
               var blog=result;
               var comments=blog.comment;
               for(var i=0 ;i<comments.length;i++){
                  var comment=comments[i];
                  if(comment._id==fields.comment_id){
                      comment.reply.push(jsonData);
                  }
               }
               BlogModel.update({_id:fields.blog_id},{$set:{"comment":comments}},function(err){
                   if(err){
                       try{
                           throw  Error(err);
                       }catch(e){
                           console.log(e);
                           res.send("-1");
                           return;
                       }
                   }
                   res.send("1");
               })

        })


    });


}
//删除回复
exports.deleteReply=function(req,res){

    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        if(err){
            try{
              throw Error(err);
            }catch(e){
                console.log(e);
                res.send("-1")
                return;
            }
        }
        BlogModel.findOne({_id:fields.blog_id},function(err,result){
            if(err){
                try{
                    throw Error(err);
                }catch(e){
                    console.log(e);
                    res.send("0");
                    return;
                }
            }
            var comments=result.comment;
            for(var i=0;i<comments.length;i++){
                var comment_item=comments[i];
                if(comment_item._id==fields.comment_id){
                    var replys=comment_item.reply;
                    for(var j=0;j<replys.length;j++){
                       var reply_item=replys[j];
                        if(reply_item._id==fields.reply_id){
                            replys.splice(j,1);
                        }
                    }
                }

            }

            BlogModel.update({_id:fields.blog_id},{$set:{comment:comments}},function(err){
                if(err){
                    try{
                        throw Error(err);
                    }catch(e){
                        console.log(e);
                        res.send("0");
                        return;
                    }
                }
                res.send("1");

            });


        })


    })

}