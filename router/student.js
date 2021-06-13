// student route to get the list of all the classes they is enrolled in

const express = require('express');
const bodyparser = require('body-parser');

const jsonparser = bodyparser.json();

const {getClasses} = require('../models/student');
const {registerStudent} = require('../models/registration');
const {studentLogin} = require('../models/authentication');
const validateToken = require('../middleware/validateToken');

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const secret = process.env.secret;

const studentRoute = express.Router();

// Student registration
studentRoute.post('/signup',jsonparser,(req,res) => {
    const student = registerStudent(req.body.name,req.body.email,req.body.password)
        .then((data) => res.header('x-auth-token',data.token).send(`Registration successful for ${data.studentResponse.name} with email ${data.studentResponse.email}.\nPlease login.`))
        .catch((err) => console.log(err))
});

// Student login
studentRoute.post('/login',jsonparser,(req,res) => {

    const validCreds = studentLogin(req.body.email,req.body.password)
        .then((data) => res.header('x-auth-token',data.token).send("Login successful"))
        .catch((err) => console.log(err));
});

// Get the list of all the classes a student is enrolled in

studentRoute.get('/',jsonparser,validateToken,(req,res) => {
    
    const token = req.header('x-auth-token');
    const payload  =  jwt.verify(token,secret);
    const studentName = payload.name;

    const classList = getClasses(studentName,req.body.roll)
        .then((classes) => res.send(classes))
        .catch((err) => res.send(err));
})

module.exports = studentRoute;