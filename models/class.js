const mongoose = require('mongoose');
const dotenv = require('dotenv');
const crypto = require('crypto');

// loads local .env file into process.env
dotenv.config();

// connecting to mongoDB
dbURI = process.env.dbURI;

mongoose.connect(dbURI,{ useNewUrlParser: true,useUnifiedTopology: true, useFindAndModify: false })
    .then(() => console.log('connected to the instructor database'))
    .catch((err) => console.log(err))

// Schema for class to be added by an instructor
const classSchema = new mongoose.Schema({
    instructorName:{
        type:String,
        required:true,
        minlength:4,
        maxlength:50
    },
    instructorID:{
        type:String,
        required: true
    },
    className:{
    type:String,
    required:true,
    minlength:5,
    maxlength:20
    },
    classID:{
        type:String,
        required:true
    }
})

// create a class model from above class schema
const classModel = new mongoose.model('class',classSchema)

// add a class to the class list
async function addClass(insName,className){
    const classes = new classModel({
        instructorName: insName,
        instructorID: crypto.createHash('md5').update(insName,'utf-8').digest('hex'),
        className: className,
        classID: crypto.createHash('md5').update(className+insName,'utf-8').digest('hex')
    })
    return await classes.save()
};

// get the list of all classes for an instructor
async function getClass(insName){
    const classList = classModel.find(insName).select('instructorName instructorID className classID -_id')
    return classList
}

// Update the class added by an instructor
async function updateClass(className,updatedClassName){
    const updatedClass = classModel
        .findOneAndUpdate(
            {className:className},
            {className:updatedClassName},
            {new:true}
        ).select({instructorName:1,instructorID:1,className:1,classID:1,_id:0})
    
    return await updatedClass;
}

// Delete a class added by an instructor
async function deleteClass(className){
    const deleteClass = classModel
        .findOneAndDelete(
            {className:className}
        ).select({instructorName:1,instructorID:1,className:1,classID:1,_id:0})
    
    return await deleteClass;
}


module.exports = {addClass,getClass,updateClass,deleteClass};