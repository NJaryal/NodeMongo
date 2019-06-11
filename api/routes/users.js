const express = require('express');
const app = express();
app.use(express.json());
const bcrypt = require('bcrypt')
const User = require('../models/user')

app.get('/users/login', (req,res) => {    
    res.render('login')
});

app.get('/users/register', (req,res) => {    
    res.render('register')
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

module.exports = app;