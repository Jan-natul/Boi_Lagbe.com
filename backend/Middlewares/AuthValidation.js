const Joi = require('joi');

const signupValidation = (req,res,next)=>{
    console.log("BODY:", req.body);
    const schema = Joi.object({
        username: Joi.string().min(2).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(20).required(),   
    });
    const {error}= schema.validate(req.body);
    if (error){
        return res.status(400)
        .json({message:"Bad request", error})
    }
    next();
}

const loginValidation = (req,res,next)=>{
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(20).required(),   
    });
    const {error}= schema.validate(req.body);
    if (error){
        return res.status(400)
        .json({message:"Bad request", error})
    }
    next();
}

module.exports = {
    signupValidation,
    loginValidation
}
