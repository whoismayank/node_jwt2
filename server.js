require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());

const posts = [
    {
        username: 'Santosh',
        title: 'Post 1'
    },
    {
        username: 'Mahendra',
        title: 'Post 2'
    }    
]
app.get('/posts',authenticateToken,(req,res)=>{
    res.json(posts.filter(post => post.username === req.user.name));
})

app.post('/login',(req,res)=>{
    // Authenticate User
    const username = req.body.username;
    const password = req.body.password;
    const user = {name: username};
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.json({accessToken:accessToken});
})


function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    })
}

app.listen(3000,()=>{
    console.log(`App is running on the PORT 3000`);
})