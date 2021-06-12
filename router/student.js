// student route to get the list of all the classes they is enrolled in

const express = require('express');
const bodyparser = require('body-parser');

const jsonparser = bodyparser.json();

const {getClasses} = require('../models/student');
const {studentRegistration} = require('../models/registration');

const studentRoute = express.Router();

// Student registration
studentRoute.post('/signup',jsonparser,(req,res) => {
    const student = registerTeacher(req.body.name,req.body.email,req.body.password)
        .then((data) => res.header('x-auth-token',data.token).send(`Registration successful for ${data.studentResponse}.\nPlease login.`))
        .catch((err) => console.log(err))
})

// Get the list of all the classes a student is enrolled in
studentRoute.get('/',jsonparser,(req,res) => {
    const classList = getClasses(req.body.name,req.body.roll)
        .then((classes) => res.send(classes))
        .catch((err) => res.send(err));
})

module.exports = studentRoute;