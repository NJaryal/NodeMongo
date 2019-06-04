const express = require('express');
const app = express();
app.use(express.json());
const CustomError = require('../../error-handler/index')
const mongoose = require('mongoose')
const News = require('../models/news')

app.get('/news', (req, res, next) => {
    News.find()
    .select('name _id')
    .exec()
    .then(data => {
        if(data.length >= 0) {
            res.status(200).json({
                count: data.length,
                newsArray: data                
            })
        } else {
            throw new CustomError('The news data is empty', 200)
        }        
    })
    .catch(err => {
        throw new CustomError(err.message, 500)        
    })  
});

app.get('/news/:id', (req, res, next) => {
    const id = req.params.id;
    News.findById(id)
    .exec()
    .then(doc => {
        res.status(200).json({
            message: 'Single News!',
            Details: doc
        })
    })
    .catch(err => {
        throw new CustomError('The news id was not found', 500)
    })   
});

app.post('/news', (req, res, next) => {
    const newsObj = new News({
        name: req.body.name
    })
    newsObj.save()
    .then(result => {
        res.status(201).json({
            Message: 'Successfully created a News!',
            createdNews: result,
        })
    })
    .catch(err => {
        throw new CustomError(err.message, 500) 
    })
});

app.put('/news/:id', (req,res,next) => {
    const id = req.params.id;
    /* const operations = {}
    for (const opr of req.body) {
        operations[opr.propName] = opr.value;
    } 
    News.update({_id: id}, { $set: operations})
    */
    News.update({_id: id}, { $set: {name: req.body.name}})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Successfully updated a News!',
            updatedNews: result
        })
    })
    .catch(err => {
        throw new CustomError(err.message, 500)
    })
})

app.delete('/news/:id', (req, res, next) => {
    const id = req.params.id;
    News.remove({_id: id})
    .exec()
    .then(result => res.status(200).json(result))
    .catch(err => {
        throw new CustomError(err.message, 500) 
    })
});
module.exports = app;

