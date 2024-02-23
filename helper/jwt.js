// const { expressjwt: jwt } = require("express-jwt");
// const api=process.env.API_URL;

// function authjwt(){
//     const secret=process.env.secret;
//     return jwt ({
//         secret,
//         algorithms:['HS256'],
//         isRevoked:isRevoked
//     }).unless({
//         path:[
//             {url:/\/api\/v1\/products(.*)/,methods:['GET','OPTIONS']},
//             {url:/\/api\/v1\/categories(.*)/,methods:['GET','OPTIONS']},
//             {url:/\/uploads(.*)/,methods:['GET','OPTIONS']},

//             `${api}/users/login`,
//             `${api}/users/register`,
            
           
            
//         ]
//     })
// }



 


// async function isRevoked(req, token){
//     if (!token.payload.isAdmin) {
//       return true;
//     }
//   }

// module.exports=authjwt;
