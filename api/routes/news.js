const express = require('express');
const app = express();
app.use(express.json());
const CustomError = require('../../error-handler/index')
const mongoose = require('mongoose')
const News = require('../models/news')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const passport = require('passport')

app.get('/users/login', (req,res) => {    
    res.render('login')
});

app.get('/users/register', (req,res) => {    
    res.render('register')
});

app.get('/news', (req, res, next) => {
    News.find()
    .select('name _id')
    .exec()
    .then(data => {
        if(!data) {
            throw new CustomError('Internal Server Error', 500)
        }
        if(data.length >= 0) {
            res.status(200).json({
                count: data.length,
                newsArray: data                
            })
        } else {
            setTimeout(function () {
                try {
                    throw new CustomError('The news data is empty', 200)
                } catch (err) {
                  next(err)
                }
            }, 100)            
        }  
    })
    .catch((next))
});

app.get('/news/:id', (req, res, next) => {
    const id = req.params.id;
    News.findById(id)
    .exec()
    .then(doc => {
        if(!doc) {
            throw new CustomError('Single News Server Error', 500) 
        } else {
            res.status(200).json({
                message: 'Single News!',
                Details: doc
            })
        }        
    })
    .catch(next)  
});

app.post('/news', (req, res, next) => {
    const newsObj = new News({
        name: req.body.name,
        author: req.body.author,
        date: req.body.date
    })
    newsObj.save()
    .then(result => {
        if(!result) {
            throw new CustomError('Internal Server Error while saving', 500)
        } else {
            res.status(201).json({
                Message: 'Successfully created a News!',
                createdNews: result,
            })
        }        
    })
    .catch(next)
});

app.put('/news/:id', (req,res,next) => {
    const id = req.params.id;
    const operations = {};
    for (const opr of req.body) {
        operations[opr.propName] = opr.value;
    } 
    News.update({_id: id}, { $set: operations})   
    .exec()
    .then(result => {
        if (!result) {
            throw new CustomError('Internal Server Error - PUT Method', 500)
        } else {
            res.status(200).json({
                message: 'Successfully updated a News!',
                updatedNews: result
            })
        }        
    })
    .catch(next)
})

app.delete('/news/:id', (req, res, next) => {
    const id = req.params.id;
    News.remove({_id: id})
    .exec()
    .then(result => {
        if(!result) {
            throw new CustomError('Unable to Delete News', 500) 
        } else {
            res.status(200).json(result)
        }        
    })
    .catch(next)
});

app.post('/users/register', (req,res,next) => {    
    bcrypt.hash(req.body.password, 10, (err, hash) =>{
        if(err) {
            throw new CustomError(err.message, 500) 
        } else {        
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: hash
            })    
            newUser.save()
            .then(result => {
                if(!result) {
                    throw new CustomError('Server error in Registration', 500) 
                } else {
                    res.status(201).json({
                        message: 'User Created'
                    });
                    res.redirect('/users/login')
                }                
            })
            .catch(next)
        }
    })   
});

//Login Handle
app.post('/users/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login'
    })(req, res, next)
})

//Logout Handle
app.get('/users/login', (req, res, next) => {
    req.logOut();
    res.redirect('/users/login');    
})

module.exports = app;

