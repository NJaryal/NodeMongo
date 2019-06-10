const express = require('express');
const app = require('./api/routes/news')
const logger = require('./utils/loggers')
const mongoose = require('mongoose')
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session')
const passport = require('passport')

//DB Config
mongoose.connect('mongodb+srv://node-news:node-news@node-news-wvps2.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true});

//Passport Config
require('./config/passport')(passport)

//CORS Handling
app.use((req,res,next) =>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin, Content-Type, Accept, Authorization')    
    next();
})

//EJS
app.use(expressLayouts)
app.set('view engine', 'ejs');

//Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

//Passport
app.use(passport.initialize());
app.use(passport.session());

//Logger to capture Api Endpoint, method and Timestamp
app.use((req,res,next) => {    
    if((res.status(200)) || (res.status(201))){
        logger.info(`Api EndPoint:${req.originalUrl}, Api Method: ${req.method}`, new Date())
    }
    next();
})

app.use((req,res,next)=> {
    const error = new Error('Not Found!')
    error.status = 404
    next(error)
})

app.use((error,req,res,next)=> {
    res.status(error.status || 500);
    res.json({
        error: {
            status: error.status,
            message: error.message
        }
    })
    logger.warn(`Error ${error.status} ` ,new Error(error.message));  
})
module.exports = app;