
const { Category } = require('../models/category');
const mongoose =require('mongoose');


const productSchema=mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
    description:{
        type:String,
        require:true,
    },
    richdescription:{
        type:String,
        default:'',
    },
    
    images :{
        type:String,
    },
    brand:{
        type:String,
        default:'',
    },
    price:{
        type:Number,
        require:0,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"category",
        require:true,
    },
    countInStock:{
        type:Number,
        require:true,
        min:0,
        max:255,
    },
    rating:{
        type:Number,
        require:0,
    },
    numReview:{
        type:Number,
        require:0,
    },
    isfeatured:{
        type:Boolean,
        require:false,
    },
    dateCreated:{
        type:Date,
        default:Date.now,
    },
    image:[{
        type:String,
        default:'',
    }],

    
})

exports.Product=mongoose.model('Product',productSchema);