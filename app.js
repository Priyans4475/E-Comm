const express=require('express');
const app=express();
require('dotenv/config');
const morgan= require('morgan');
const bodyParser= require('body-parser');
const authjwt=require('./helper/jwt');
// const errorhandler=require('./helper/err-handler');

const mongoose=require('mongoose');

app.use(bodyParser.json());
app.use(morgan('tiny'));
// app.use(authjwt());
app.use('/uploads', express.static('/uploads'));

// app.use((error,req,res,next)=>{
//     if(error.name==='unauthorizedError'){
//        return res.status(401).json({message: "The user is not authorised"});
//     }

//     if(error.name==='ValidationError'){
//        return  res.status(401).json({message: error});
//     }
//     return  res.status(401).send(error.message);
// });




const categoriesRoutes=require('./routers/categories');
const productsRoutes=require('./routers/products');
const ordersRoutes=require('./routers/orders');
const usersRoutes=require('./routers/users');
// const authjwt = require('./helper/jwt');

const api=process.env.API_URL;

app.use(`${api}/categories`,categoriesRoutes);
app.use(`${api}/products`,productsRoutes);
app.use(`${api}/orders`,ordersRoutes);
app.use(`${api}/users`,usersRoutes);






mongoose.connect(process.env.DB_URI).then(()=>{
    console.log('database connected successfully');
})
.catch((err)=>{
    console.log(err);
})


app.listen(3000,()=>{
    console.log(api);
    console.log('server is running perfectly on http://localhost:3000');
})