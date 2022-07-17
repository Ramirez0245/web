const User_Model = require('../../models/User.model');;
const Validation = require('../../../validation');
const bcrypt = require('bcrypt');

const Register_user_post = async (req, res, next) =>
{
    try {
        console.log('register user ran');
        //VALIDATE INPUT
        const { error } = Validation.UserValidation(req);
        if (error) {
            const comment = error.details[0].message;
            if(error.details[0].message === '"repeatpassword" must be [ref:password]')
                {return res.status(400).send('passwords do not match')}
            return res.status(400).send(comment);
        }
        console.log(typeof req.body)

        //GRAB USER
        const searchUserName = await User_Model.find( {UserName: req.body.username} );
        const searchEmail = await User_Model.find({Email: req.body.email });
        if (searchUserName.length >= 1) return res.status(400).send('This username is already taken');
        if (searchEmail.length > 0 ) return res.status(400).send('Email is already used');
        if (searchUserName.length == 0 && searchEmail.length == 0)
        {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const user = await new User_Model({
                UserName: req.body.username, 
                Email: req.body.email, 
                Password: hashedPassword,

                FirstName: 'none',
                LastName: 'none',
                Sex: 'none', 
                Company: 'none',
                Height: 1,
                BloodType: 'none',
                PhoneNumber: 0,
                Address: 'none',
                AddressTwo: 'none'
            });
            
            await user.save();
            console.log('REGISTER SUCCESS');
            return res.status(200).send('User has been registered');
        }
        return res.status(500).send('Internal error');
    } catch(err) {
        console.log(err)
        return res.status(500).send('Internal error');
    }
}

function checkNotAuthenticated(req, res, next) {
    console.log('checkAuthenticated ran')
    if(req.isAuthenticated()) {
        return res.send('Already logged in')
    }
    next() 
}

exports.checkNotAuthenticated = checkNotAuthenticated;
exports.Register_user_post = Register_user_post;

