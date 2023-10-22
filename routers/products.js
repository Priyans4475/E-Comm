const { Category } = require('../models/category');
const {Product}=require('../models/product');
const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const multer  = require('multer');

const FILE_TYPE_MAP={
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg',
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isvalid=FILE_TYPE_MAP[file.mimetype];

        let uploaderr=new Error('invalid image type')

        if(isvalid)
        {
            uploaderr=null
        }
      cb(uploaderr, "./uploads")
    },
    filename: function (req, file, cb) {
      const fileName=file.originalname.split(' ').join('-');
      const extension=FILE_TYPE_MAP[file.mimetype];
      cb(null, fileName + '-' + Date.now()+ '.' + extension)
    }
  })
  
  const uploadOptions = multer({ storage: storage })

// ****************************************API for getting the details of the Product.**************************************************
router.get('/',async(req,res)=>
{
    const productList=await Product.find().populate('category');

    if(!productList)
    {
        res.status(500).json({success:false});
    }
    res.send(productList);
})

// ****************************************API for getting the details of the Product from the Product ID.***********************************************
router.get('/:id',async(req,res)=>
{
    const product=await Product.findById(req.params.id);

    if(!product)
    {
        res.status(500).json({success:false});
    }
    res.send(product);
})


// ****************************************API for Updating the details of the Product.***********************************************
router.put('/:id',async(req,res)=>
{   if(!mongoose.isValidObjectId(req.params.id)){
    return res.status(400).send('Invalid  Id');
}
    const category = await Category.findById(req.body.category)
    if(!category)
    {
     return res.status(400).send('Invalid category')
    }
   const productupdate= await Product.findByIdAndUpdate(
      req.params.id,{
        name:req.body.name,
        description:req.body.description,
        richdescription:req.body.richdescription,
        images:req.body.images,
        brand:req.body.brand,
        price:req.body.price,
        category:req.body.category,
        countInStock:req.body.countInStock,
        rating:req.body.rating,
        numReviews:req.body.numReviews,
        isfeatured:req.body.isfeatured
      },
      {new:true}
      )
   if(!productupdate)
   return res.status(400).send('the product cant be Updated');

   res.send(productupdate);
})
// ****************************************API for Creating the details of the Product.***********************************************
router.post('/',uploadOptions.single('images'),async(req,res)=>{
    const category = await Category.findById(req.body.category)
    if(!category)
    {
     return res.status(400).send('Invalid category')
    }

    const file=req.file;
    if(!file)
    {
     return res.status(400).send('Image is not present there');
    }
    const fileName=file.filename;

    const basePath=`${req.protocol}://${req.get('host')}/uploads`
    console.log(basePath);
    let product=new Product({
        name:req.body.name,
        description:req.body.description,
        richdescription:req.body.richdescription,
        images:`${basePath}${fileName}`,
        brand:req.body.brand,
        price:req.body.price,
        category:req.body.category,
        countInStock:req.body.countInStock,
        rating:req.body.rating,
        numReviews:req.body.numReviews,
        isfeatured:req.body.isfeatured
    })
    product= await product.save();

    if(!product){
        res.status(500).send("the product is not created");
    }

    res.send(product);
    

})
// ****************************************API for deleting of the Product from the ID.***********************************************
router.delete('/:id',async(req,res)=>{
    Product.findByIdAndRemove(req.params.id).then(product=>{
       if(product)
       {
         return res.status(200).json({success:true,message:"product is deleted"});
       }
       else
       return res.status(404).json({success:false,message:"product is not found"});
    }).catch(err=>{
       return res.status(400).json({success:false,error:err});
    })
 })

 

 router.put('/gallery-image/:id',uploadOptions.array("image" , 5),async(req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send('Invalid product ID')
    }

    const files=req.files;
    let imagePath=[];
    const basePath=`${req.protocol}://${req.get('host')}/uploads`

    if(files)
    {
        files.map(file=>{
            imagePath.push(`${basePath}${file.filename}`);
        })
    }

    const productupdate= await Product.findByIdAndUpdate(
        req.params.id,{
            image : imagePath
        },
        {new:true}

    )

    if(!productupdate)
    return res.status(400).send('the product cant be Updated');
 
    res.send(productupdate);

 })

module.exports=router;