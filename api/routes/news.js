const express = require('express');
const app = express();
app.use(express.json());
const CustomError = require('../../error-handler/index')
const mongoose = require('mongoose')
const News = require('../models/news')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const passport = require('passport')
const facebookStrategy = require('passport-facebook')

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
        if(data.length >= 10) {
            res.status(200).json({
                count: data.length,
                newsArray: data                
            })
        } else {            
            throw new CustomError('The news data is empty', 200)           
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

app.post('/users/register', (req,res) => {
    const { name, email, password, confPassword} = req.body;
    let errors = [];
    //Required Fields
    if(!name || !email || !password || !confPassword) {
        errors.push({Msg: 'Please fill in all the Fields'})
    }
    //Password Match
    if(password !== confPassword) {
        errors.push({Msg: 'Passwords do not match'})
    }
    if(errors.length> 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            confPassword

        })
    } else {
        User.findOne({email: email})
        .then(user => {
            if(user) {
                errors.push({Msg: 'Email ID already Exists'})
                res.render('register',{
                errors,
                name,
                email,
                password,
                confPassword    
                })
            } else {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: hash
                })

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) =>{
                        if(err) {
                           throw new CustomError('Failed to register user', 500) 
                        }      
                        newUser.password = hash;
                        newUser.save()
                        .then(result => {
                            if(!result) {
                                throw new CustomError('Internal Server Error while saving', 500)
                            } else {
                                res.redirect('/users/login')
                                res.status(201).json({
                                    message: 'User successfully Created',
                                    RegisteredUser: result
                                });
                            }                                        
                        })
                        .catch(next)                        
                    })
                })
            }              
        })
    }
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

const FACEBOOK_CLIENT_ID='458926694679667',
    FACEBOOK_CLIENT_SECRET='c105cda26d7116215949f92b2afcb371'
    FACEBOOK_CALLBACK_URL='http://127.0.0.1:3000/auth/facebook?cb'

//Login With facebook
const fbOptions = {
   clientID: FACEBOOK_CLIENT_ID,
   clientSecret: FACEBOOK_CLIENT_SECRET,
   callbackURL: FACEBOOK_CALLBACK_URL,
   profileFields: ['emails']
}
const fbCallback = (accessToken, refreshToken, profile, cb) => {
    console.log(accessToken, refreshToken, profile)
}
passport.use(new facebookStrategy(fbOptions, fbCallback))
app.get('/facebook', passport.authenticate('facebook', { scope: ['email']}))
app.get('auth/facebook/callback',passport.authenticate('facebook', (err, user, info) => {
    console.log(err, user, info);
    })    
)
module.exports = app;

