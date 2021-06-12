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
    classes:
        [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'classes',
                 required: false
            }
        ]
        
    
})

// student model based on above schema
const studentModel = new mongoose.model('student',studentSchema);


// Database end points for crud on student collection, by teacher
// Add a student
async function addStudent(studentName,roll,grade,className){

   let classObject =  await  classModel.findOne({className:className})  

    // check if the student exists
    let isAdded = studentModel.findOne({name:studentName,roll:roll})

    if(!isAdded){

        const newStudent = new studentModel({
            name:studentName,
            roll:roll,
            grade: grade,
            classes: classObject
            
        
        })
        return await newStudent.save();

    } else
        return "Student with given credential already exist. Try updating instead !!"


}

// Get the classes enrolled for an student
async function getClasses(studentName,roll){

    let classID = [];
    let classList = [];

    const classesEnrolled = await studentModel.find({name:studentName,roll:roll}).select({classes:1,_id:0})

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


    const updatedClass = await studentModel.findOneAndUpdate({
        query,

        name:newName,
        roll:newRoll,
        grade:newGrade,
        $push: {classes:classObject},
    
        new:true

    })
    return await updatedClass.save()
}

// Delete a student from a class
async function deleteStudent(roll,classDetail){

    // Get class object id
    let deleteClassId = await classModel.find({className:classDetail}).select({_id:1})


    if(deleteClassId.length > 0){
        deleteClassId =  deleteClassId[0]._id

        const studentDetail = await studentModel.findOne({roll:roll})

        .then((studentInfo) => {
            let classes = studentInfo.classes;
            let index = classes.indexOf(deleteClassId);
            let updatedClasses = classes.splice(index,1);

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