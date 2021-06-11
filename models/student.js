// Student Model, to be consumed by teacher route

const mongoose = require('mongoose');
const {classModel} = require('../models/class')

const dotenv = require('dotenv')
dotenv.config()

dbURI = process.env.dbURI;

mongoose.connect(dbURI,{ useNewUrlParser: true,useUnifiedTopology: true, useFindAndModify: false })
    .then(() => console.log('connected to the student database'))
    .catch((err) => console.log(err))

// Student Schema
const studentSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:4,
        maxlength:20
    },
    roll:{
        type:String,
        required:true,
        minlength:10,
        maxlength:10
    },
    grade:{
        type: Number,
        required:true
    },
    classID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'classes',
        required: false
    }
})

// student model based on above schema
const studentModel = new mongoose.model('student',studentSchema);


// Database end points for crud on student collection, by teacher
// Add a student
async function addStudent(studentName,roll,grade,className){

   let classes =  await  classModel.findOne({className:className})  

    const newStudent = new studentModel({
        name:studentName,
        roll:roll,
        grade: grade,
        classID: classes
        
    
})
    return await newStudent.save();
}

// Get the classes enrolled for an student
async function getClasses(studentName,roll){
    const classesEnrolled = await studentModel.findOne({name:studentName,roll:roll})

    let classesID = classesEnrolled.classID
    let classList = await classModel.findOne({_id:classesID}).select({instructorName:1,className:1})

    return classList;
}

// Update the classes enrolled by an student
async function updateClasses(studentName,roll,classDetail){

    let query = {name:studentName,roll:roll}
    const updatedClass = await studentModel.findOneAndUpdate({
        query,
        
    })
}

module.exports = {addStudent,getClasses};