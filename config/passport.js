const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose') 
const bcrypt = require('bcrypt')

//Load user Model
const User = require('../api/models/user');

module.exports = (passport) => {
    passport.use(
        new LocalStrategy({username: 'email'},(email, password, done)=>{
            //Match User
            User.findOne({email: email})
            .then(user => {
                if(!user){
                    return done(null, false, {message: 'Email is not registered'})
                }

                //Match Password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) throw err;

                    if(isMatch) {
                        return done(null, user)
                    } else {
                        return done(null, false, {message: 'Password is incorrect'})
                    }
                })
            })
            .catch( err => console.log(err))
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
      });
      
      passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          done(err, user);
        });
      });
}