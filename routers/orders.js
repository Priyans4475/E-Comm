const {Order}=require('../models/order');
const express=require('express');
const router=express.Router();
const {OrderItem}=require('../models/order-item');


// ****************************************API for getting the detail's of orders.**************************************************
router.get('/',async(req,res)=>{
    const orderList=await Order.find().populate('user','name').sort('dateOrdered');


    if(!orderList){
        res.status(500).json({success:false})
    }
    res.send(orderList);
})

// ****************************************API for getting the details of the orders,Product in order, Category of Product. from a particular ID's**************************************************
router.get('/:id',async(req,res)=>{
    const order=await Order.findById(req.params.id).populate('user','name')
    .populate({path:'orderItems',populate:{path:'product',populate:'category'}});


    if(!order){
        res.status(500).json({success:false})
    }
    res.send(order);
})


router.post('/',async(req,res)=>{
    const orderItemsIds= Promise.all(req.body.orderItems.map(async (orderItem) =>{
        let newOrderItem=new OrderItem({
            quantity:orderItem.quantity,
            product:orderItem.product
        })

        newOrderItem= await newOrderItem.save();

        return newOrderItem._id;
    }))
   const orderItemsIdsResolved=await orderItemsIds;
    console.log(orderItemsIdsResolved);
 // ****************************************Method for calculating totalprices of the orders.**************************************************
    const totalItemPrice= await Promise.all(orderItemsIdsResolved.map(async orderItemId=>{
        const orderItem=await OrderItem.findById(orderItemId).populate('product','price')
        const totalPrice=orderItem.product.price * orderItem.quantity;
        return totalPrice; 
    }))

    const newtotalPrice=totalItemPrice.reduce((a,b)=>a+b,0);

    let order=new Order({
     orderItems:orderItemsIdsResolved,
     shippingAddress1:req.body.shippingAddress1,
     shippingAddress2:req.body.shippingAddress2,
     city:req.body.city,
     zip:req.body.zip,
     country:req.body.country,
     phone:req.body.phone,
     status:req.body.status,
     totalPrice:newtotalPrice,
     user:req.body.user,
     dateOrdered:req.body.dateOrdered,
     

 
    })
    order=await order.save();
 
    if(!order)
    return res.status(400).send('the order cant be created');
 
    res.send(order);
 })

 // ****************************************API for  Updating the orders**************************************************
 router.put('/:id',async(req,res)=>
{
   const order= await Order.findByIdAndUpdate(
      req.params.id,{
       status:req.body.status,
      
      },
      {new:true}
      )
   if(!order)
   return res.status(400).send('the order cant be Updated');

   res.send(order);
})
// ****************************************API for  Deleting the orders.**************************************************
router.delete('/:id',async(req,res)=>{
    Order.findByIdAndRemove(req.params.id).then( async order=>{
       if(order)
       {
        await order.orderItems.map(async orderItem=>{
        await OrderItem.findByIdAndRemove(orderItem);
        })
         return res.status(200).json({success:true,message:"order is deleted"});
       }
       else
       return res.status(404).json({success:false,message:"order is not found"});
    }).catch(err=>{
       return res.status(400).json({success:false,error:err});
    })
 })
// ****************************************API for  generating the total sales till date.**************************************************
 router.get('/get/totalSales/',async(req,res)=>{
    const totalSales=await Order.aggregate([
        {
            $group:{_id:null,totalsales:{$sum:'$totalPrice'}}
        }
    ]
    )


    if(!totalSales){
        res.status(400).send("the sales cant be generated");
    }
    res.send({totalsales:totalSales.pop().totalsales});
})
// ****************************************API for  generating the total number of Orders .**************************************************
router.get('/get/count',async(req,res)=>{
    const OrderList=await Order.countDocuments()

    if(!OrderList)
    {
         res.status(500).json({success:false});
    }

    res.send({
        OrderList:OrderList
    });
})
// ****************************************API for  generating the total number of orders taken from the user's end.**************************************************
router.get('/get/userorder/:userid',async(req,res)=>{
    const orderorderList=await Order.find({user:req.params.userid}).populate({path:'orderItems',populate:{path:'product',populate:'category'}})
    .sort('dateOrdered');


    if(!orderorderList){
        res.status(500).json({success:false})
    }
    res.send(orderorderList);
})

module.exports=router;