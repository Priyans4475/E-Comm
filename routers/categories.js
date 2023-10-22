const {Category}=require('../models/category');
const express=require('express');
const router=express.Router();
// ****************************************API for getting the details of Category**************************************************
router.get('/',async(req,res)=>{
   const categoryList=await Category.find();

   if(!categoryList)
   {
      res.status(500).json({success:false});
   }
   res.status(200).send(categoryList);
})
// ****************************************API for getting the details of Category from the ID .**************************************************
router.get('/:id',async(req,res)=>{
   const categoryID= await Category.findById(req.params.id);

   if(!categoryID)
   {
      res.status(500).json({message:"the category id provided have not been found"});
   }
   res.status(200).send(categoryID);

})
// ****************************************API for Posting the Category.**************************************************
router.post('/',async(req,res)=>{
   let category=new Category({
    name:req.body.name,
    icon:req.body.icon,
    color:req.body.color,

   })
   category=await category.save();

   if(!category)
   return res.status(400).send('the category cant be created');

   res.send(category);
})

// ****************************************API for Updating Category.**************************************************
router.put('/:id',async(req,res)=>
{
   const categoryUpdate= await Category.findByIdAndUpdate(
      req.params.id,{
       name:req.body.name,
       icon:req.body.icon,
       color:req.body.color
      },
      {new:true}
      )
   if(!categoryUpdate)
   return res.status(400).send('the category cant be Updated');

   res.send(categoryUpdate);
})
// ****************************************API for  Deleting the Category of the Product.**************************************************
router.delete('/:id',async(req,res)=>{
   Category.findByIdAndRemove(req.params.id).then(category=>{
      if(category)
      {
        return res.status(200).json({success:true,message:"Category is deleted"});
      }
      else
      return res.status(404).json({success:false,message:"category is not found"});
   }).catch(err=>{
      return res.status(400).json({success:false,error:err});
   })
})

module.exports= router;