const JWT= require("jsonwebtoken");

exports.login=(req,res,next)=>{
    const {email , password} = req.body;
    if(!email || !password){
// next(new AppErorr)
    }
const token = "";
res.status(200).json({
    status:"success" , 
    token
})
}