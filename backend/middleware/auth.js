const jwt=require('jsonwebtoken')
const User=require('../model/model')
const crypto=require('crypto')
require('dotenv').config({ path: __dirname + '/../.env' });

const jwtSecretKey = process.env.JWTSECRETKEY
console.log("Generated JWT Secret Key  from auth:", jwtSecretKey);
const authenticate=   async (req,res,next)=>{
    try{
        const tokenHeader=req.header('Authorization')
        const token = tokenHeader ? tokenHeader.replace('Bearer ', '') : null;
        console.log('token received>>>>>>>>>>>>',token);
        const decode=jwt.verify(token,jwtSecretKey)
        console.log('userid>>>',decode.userId)
       const user= await User.findByPk(decode.userId)
            req.user=user;
            req.ispremiumuser = decode.ispremiumuser;
            next();
        
    }
    catch(error){
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ success: false, msg: 'Access token has expired' });
          } else if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ success: false, msg: 'Invalid access token' });
          } else {
            console.log('error from auth>>>>', error);
            return res.status(500).json({ success: false, msg: 'Internal server error' });
          }
        
    }
}
module.exports={
    authenticate}