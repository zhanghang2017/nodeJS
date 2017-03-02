/**
 * Created by admin on 2017/1/15.
 */
var md5=require("md5");
exports.md5=function(password){
    return md5(md5(password));
}
