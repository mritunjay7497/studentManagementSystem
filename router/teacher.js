const express = require('express');

const bodyparser = require('body-parser');
const jsonparser = bodyparser.json();

const {registerTeacher} = require('../models/registration');
const {teacherLogin} = require('..//models/authentication');
const {addStudent,getClasses,updateClasses,deleteStudent} = require('../models/student');
const validateToken = require('../middleware/validateToken');

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const secret = process.env.secret;

const teacherRoutes = express.Router();

// Regiatration end-point for teacher
teacherRoutes.post('/signup',jsonparser,(req,res) => {
    const teacher = registerTeacher(req.body.name,req.body.email,req.body.password)
        .then((data) => res.header('x-auth-token',data.token).send(`Registration successful for ${data.teacherResponse.name} with email ${data.teacherResponse.email}.\nPlease login`))
        .catch((err) => console.log(err))
})

// Teacher login route
teacherRoutes.post('/login',jsonparser,(req,res)=>{
    const validCreds = teacherLogin(req.body.email,req.body.password)
        .then((data) => res.header('x-auth-token',data.token).send("Login successful"))
        .catch((err) => console.log(err));
});


// A teacher can do CRUD operation on student collection

// Add a student
teacherRoutes.post('/',jsonparser,validateToken,(req,res)=>{
    const newStudent = addStudent(req.body.name,req.body.roll,req.body.grade,req.body.className,req.body.email)
        .then((student) => res.send(`${student}`))
        .catch((err) => console.log(err));
})

// Get student list
teacherRoutes.get('/',jsonparser,validateToken,(req,res)=>{
    const studentList = getClasses(req.body.name,req.body.roll)
        .then((students) => res.send(students))
        .catch((err) => console.log(err));
})

// update student details
teacherRoutes.put('/',jsonparser,validateToken,(req,res)=>{
    const updatedStudent = updateClasses(req.body.roll,req.body.newName,req.body.newRoll,req.body.grade,req.body.className)
        .then((student) => res.send(`${student}`))
        .catch((err) => console.log(err));
})

// delete a student
teacherRoutes.delete('/',jsonparser,validateToken,(req,res) => {
    const deletedStudent = deleteStudent(req.body.roll,req.body.className)
        .then((student) => res.send(`${student}`))
        .catch((err) => console.log(err))
})


module.exports = teacherRoutes;