const express = require('express');
const bodyparser = require('body-parser');

const jsonparser = bodyparser.json();

const {addInstructor,getInstructor,updateInstructor,deleteInstructor} = require('../models/instructor')
const {addStudent,getStudent,updateStudent,deleteStudent} = require('../models/student')

const teacherRoutes = express.Router();

// A teacher can do CRUD operation on student collection



// CRUD for a student
// Add a student
teacherRoutes.post('/stu',jsonparser,(req,res)=>{
    const newStudent = addStudent(req.body.name,req.body.grade,req.body.serial)
        .then((student) => res.send(`Following student was added\n${student}`))
        .catch((err) => console.log(err));
})

// Get student list
teacherRoutes.get('/stu',(req,res)=>{
    const studentList = getStudent()
        .then((students) => res.send(students))
        .catch((err) => console.log(err));
})

// update student details
teacherRoutes.put('/stu',(req,res)=>{
    const updatedStudent = updateStudent(req.body.name,req.body.newName,req.body.grade,req.body.rollNo)
        .then((student) => res.send(`Following student was updated\n${student}`))
        .catch((err) => console.log(err));
})

// delete a student
teacherRoutes.delete('/stu',(req,res) => {
    const deletedStudent = deleteStudent(req.body.name)
        .then((student) => res.send(`Student deleted\n${student}`))
        .catch((err) => console.log(err))
})