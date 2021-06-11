const express = require('express');
const bodyparser = require('body-parser');

const {addClass,getClass,updateClass,deleteClass} = require('../models/class');

const instructorRoute = express.Router();

// create application/json parser
const jsonparser = bodyparser.json()

// Route to get all class list added by an instructor
instructorRoute.get('/',(req,res) => {

    const classList = getClass()
        .then((classList) => {
            res.send(classList)
        })
        .catch((err) => console.log(err))
})

// Route to add a new class by an instructor
instructorRoute.post('/',jsonparser,(req,res) => {

    const classes = addClass(req.body.insName,req.body.className)
        .then((classes) => res.send(`Class ${classes}\nadded successfully`))
        .catch((err) => console.log(err));
})

// Route to update an existing class by an instructor
instructorRoute.put('/',jsonparser,(req,res)=>{

    const updatedClass = updateClass(req.body.className,req.body.updatedClassName)
        .then((newClass) => res.send(newClass))
        .catch((err) => console.log(err))
})

// Route to delete an existing class by the instructor
instructorRoute.delete('/',jsonparser,(req,res) => {

    const deletedClass = deleteClass(req.body.className)
        .then((data) => res.send(`class\n${data}\ndeleted successfully`))
        .catch((err) => console.log(err))
})

module.exports = instructorRoute;