const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json());

const post = [
    {
    name:'Monis',
    title:'post1'
},
    {
    name:'Monis',
    title:'post2'
}
]

app.get('/post', AuthenticateUser , (req,res,next) => {
   res.send(req.user);

})

app.post('/login',(req,res,next) => {
    const userName = req.body.name;
    const user = {name:userName};
    
    const accessToken1 = 'bc6616810748f82233e36371e933441f93faec2b3828d2fa2979cee5dad3c0984514fc2337dd3794122d1a7b35ddee30905aea6873291427e5b561e54b4f54b1'
    const accessToken = jwt.sign(user, accessToken1);
    
    res.json(accessToken);
})

function AuthenticateUser(req,res,next){
    const auth = req.headers['authorization'];
    const token = auth && auth.split(' ')[1];

    if(auth===null) return res.sendStatus(403);

    jwt.verify(token, 'bc6616810748f82233e36371e933441f93faec2b3828d2fa2979cee5dad3c0984514fc2337dd3794122d1a7b35ddee30905aea6873291427e5b561e54b4f54b1' , (err,user) =>{
        if(err) return res.send(err);

        req.user = user;
        next();
    })
    

}

app.listen(3000, () => {
    console.log("Server  Started at 3000",);
})