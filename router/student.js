// student route to get the list of all the classes they is enrolled in

const express = require('express');
const bodyparser = require('body-parser');

const jsonparser = bodyparser.json();

const {getClasses} = require('../models/student');

const studentRoute = express.Router();

// Get the list of all the classes a student is enrolled in
studentRoute.get('/',jsonparser,(req,res) => {
    const classList = getClasses(req.body.name,req.body.roll)
        .then((classes) => res.send(classes))
        .catch((err) => res.send(err));
})

module.exports = studentRoute;