const express = require('express');
const bodyparser = require('body-parser');

const {addClass,getClass,updateClass,deleteClass} = require('../models/class');
const {registerInstructor} = require('../models/registration');
const {instructorLogin} = require('../models/authentication');
const {validateToken} = require('../middleware/validateToken');


const instructorRoute = express.Router();

// create application/json parser
const jsonparser = bodyparser.json()

// instructor registration
instructorRoute.post('/signup',jsonparser,(req,res) => {
    const instructor = registerInstructor(req.body.name,req.body.email,req.body.password)
        .then((data) => res.header('x-auth-token',data.token).send(`Registration successful for ${data.instructorResponse}.\nPlease login.`))
        .catch((err) => console.log(err))
});

// Instructor login
instructorRoute.post('/login',jsonparser,(req,res) => {
    const validCreds = instructorLogin(req.body.email,req.body.password)
    .then((data) => res.header('x-auth-token',data.token).redirect('/api/instructor/').send("Login successful"))
    .catch((err) => console.log(err));
});



// Route to get all class list added by an instructor
instructorRoute.get('/',jsonparser,validateToken,(req,res) => {

    const classList = getClass(req.body.insName)
        .then((classList) => {
            res.send(classList)
        })
        .catch((err) => console.log(err))
})

// Route to add a new class by an instructor
instructorRoute.post('/',jsonparser,validateToken,(req,res) => {

    const classes = addClass(req.body.insName,req.body.className)
        .then((classes) => res.send(`Class ${classes}\nadded successfully`))
        .catch((err) => console.log(err));
})

// Route to update an existing class by an instructor
instructorRoute.put('/',jsonparser,validateToken,(req,res)=>{

    const updatedClass = updateClass(req.body.className,req.body.updatedClassName)
        .then((newClass) => res.send(newClass))
        .catch((err) => console.log(err))
})

// Route to delete an existing class by the instructor
instructorRoute.delete('/',jsonparser,validateToken,(req,res) => {

    const deletedClass = deleteClass(req.body.className)
        .then((data) => res.send(`class\n${data}\ndeleted successfully`))
        .catch((err) => console.log(err))
})

module.exports = instructorRoute;