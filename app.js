const express = require('express');
const app = require('./api/routes/news')
const logger = require('./utils/loggers')

//CORS Handling
app.use((req,res,next) =>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin, Content-Type, Accept, Authorization')    
    next();
})

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