// Student Model, to be consumed by teacher route

const mongoose = require('mongoose');

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
    classEnrolled:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'classes',
        required: true
    }
})

// student model based on above schema
const studentModel = new mongoose.model('student',studentSchema);

// Database end points for crud on student collection, by teacher
// Add a student
async function addstudent(name,roll,grade){

    const newStudent = new studentModel({
        name:name,
        roll:roll,
        grade: grade,
        classEnrolled: 
    })
}