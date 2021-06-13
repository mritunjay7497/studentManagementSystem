// Student admission Model, to be consumed by teacher route

const mongoose = require('mongoose');
const {classModel} = require('../models/class')
const {studentModel} = require('./registration')

const dotenv = require('dotenv')
dotenv.config()

dbURI = process.env.dbURI;

mongoose.connect(dbURI,{ useNewUrlParser: true,useUnifiedTopology: true, useFindAndModify: false })
    .then(() => console.log('connected to the student database'))
    .catch((err) => console.log(err))

// Student enrolled Schema
const enrollSchema = new mongoose.Schema({
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
   
    classes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'classes',
                required: false
        }
    ]    
    
})

// student model based on above schema
const enrollModel = new mongoose.model('Enroll',enrollSchema)


// Database end points for crud on student collection, by teacher
// Add a student
async function addStudent(studentName,roll,grade,className,email){

    // check if class is added by instructor
    let classObject =  await  classModel.findOne({className:className})  

    // check if the student exists 
    let isAvailable = await studentModel.findOne({name:studentName,email:email})

    // check if student is already enrolled
    let isEnrolled = await enrollModel.findOne({name:studentName,roll:roll})


    if(isAvailable && classObject && !isEnrolled){

        const enroll = new enrollModel({
            name:studentName,
            roll:roll,
            grade: grade,
            classes: classObject          
        })
        
        return await enroll.save();
    } 
    else
        return "Student with given credential already exist in the class. Try updating instead !!";


}

// Get the classes enrolled for an student
async function getClasses(studentName,roll){

    let classID = [];
    let classList = [];

    const classesEnrolled = await enrollModel.find({name:studentName,roll:roll}).select({classes:1,_id:0})

    if(classesEnrolled.length>0){

        classID = classesEnrolled[0].classes


        for(let i=0; i<classID.length; i++){
        classList.push(await classModel.find({_id:classID[i]}).select({instructorName:1,className:1}))
        }

        return classList;

    } else 
        return "No such students found..."

}

// Update the classes enrolled by an student
async function updateClasses(roll,newName,newRoll,newGrade,classDetail){

    let query = {roll:roll};
    let classObject =  await  classModel.findOne({className:classDetail})  

    if(!classObject){
        return "No such class exists."
    }
    else {

        const updatedClass = await enrollModel.findOneAndUpdate({
            query,
    
            name:newName,
            roll:newRoll,
            grade:newGrade,
            $push: {classes:classObject},
        
            new:true
    
        })
        return await updatedClass.save()
        
    }


    
}

// Delete a student from a class
async function deleteStudent(roll,classDetail){

    // Get class object id
    let deleteClassId = await classModel.find({className:classDetail}).select({_id:1})


    if(deleteClassId.length > 0){
        deleteClassId =  deleteClassId[0]._id

        const studentDetail = await enrollModel.findOne({roll:roll})

        .then((studentInfo) => {
            let classes = studentInfo.classes;
            let index = classes.indexOf(deleteClassId);
            classes.splice(index,1);
            let updatedClasses = classes;

            studentInfo.classes = updatedClasses;
            studentInfo.markModified('classes');

            studentInfo.save();
            return studentInfo;
        })
        .catch((err) => console.log(err));
    } else
        return "No such class found..."

}
    
   
module.exports = {addStudent,getClasses,updateClasses,deleteStudent};