require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json());

let refreshTokenArray = [];

const post = [
    {
    name:'monis',
    title:'post1'
},
    {
    name:'Monis',
    title:'post2'
}
]

app.get('/post', AuthenticateUser , (req,res,next) => {

   res.send(post.filter(items => items.name ===  req.user.name));

})

app.post('/token',(req,res,next) => {
    let token = req.body.token;
    if(token === null) return res.send("null");
    if(!refreshTokenArray.includes(token)) return res.sendStatus(403);
    jwt.verify(token,process.env.REFRESH_SECRET_TOKEN , (err,user) => {
        if(err) res.send("err");
        let userName ={name: user.name};
        let acessToken = jwt.sign(userName,process.env.ACCESS_SECRET_TOKEN);
        res.json({acessToken:acessToken});
    } )
})


app.delete('/logout',(req,res) => {
   let refreshToken = req.body.token;
  refreshTokenArray = refreshTokenArray.filter(items => items !== refreshToken )
   res.send("LOGOUT")
})

app.post('/login',(req,res,next) => {
    const userName = req.body.name;
    const user = {name:userName};
    
    const accessToken = jwt.sign(user, process.env.ACCESS_SECRET_TOKEN );
    const refreshToken = jwt.sign(user, process.env.REFRESH_SECRET_TOKEN);  
     refreshTokenArray.push(refreshToken);
    res.json({"acessToken":accessToken,"refreshToken":refreshToken});
})

function AuthenticateUser(req,res,next){
    const auth = req.headers['authorization'];
    const token = auth && auth.split(' ')[1];

    if(auth===null) return res.sendStatus(403);

    jwt.verify(token, process.env.ACCESS_SECRET_TOKEN  , (err,user) =>{
        if(err) return res.send(err);

        req.user = user;
        next();
    })
    

}

app.listen(3000, () => {
    console.log("Server  Started at 3000",);
})