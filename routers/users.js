const {User}=require('../models/user');
const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const jwt =require('jsonwebtoken');
// ****************************************API for getting the details of the all User's.***********************************************
router.get('/',async(req,res)=>
{
    const productList=await User.find();

    if(!productList)
    {
        res.status(500).json({success:false});
    }
    res.send(productList);
})
// ****************************************API for posting details of the User.***********************************************
router.post('/',async(req,res)=>{
    


    let user=new User({
        name:req.body.name,
        email:req.body.email,
        passwordhash:req.body.password,
        phone:req.body.phone,
        isAdmin:req.body.isAdmin,
        street:req.body.street,
        apartment:req.body.apartment,
        zip:req.body.zip,
      
        city:req.body.city,
        country:req.body.country
    })
    user= await user.save();

    if(!user){
        res.status(500).send("the user is not created");
    }

    res.send(user);
    

})
// ****************************************API for getting Logged In as a User.***********************************************
router.post('/login',async(req,res)=>{
    const user=await User.findOne({email:req.body.email});
    const secret=process.env.secret;
    if(!user)
    {
        return res.status(400).send("The user not found");
    }
// ****************************************Method for checking the authorization.***********************************************
    if(user && bcrypt.compareSync(req.body.password,user.passwordhash)){
        const token=jwt.sign({
            userId:user.id,
            isAdmin:user.isAdmin

        },
        secret,
        {expiresIn:'1d'}
       
        )
        res.status(200).send({user:user.email,token:token});
    }
    else
    res.status(400).send("password is wrong");

   

})

// ****************************************API for getting the numbers of the User in the Database.***********************************************
router.get('/get/count',async(req,res)=>{
    const usercount=await User.countDocuments()

    if(!usercount)
    {
         res.status(500).json({success:false});
    }

    res.send({
        usercount:usercount
    });
})
module.exports=router;