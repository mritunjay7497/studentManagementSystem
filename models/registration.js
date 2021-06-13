// This module setup the registration process for Teacher,Instructor and Student

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const lodash = require('lodash');

// loads the local .env file into process.env
dotenv.config();

// connectiong to the mongoDB
dbURI = process.env.dbURI;

mongoose.connect(dbURI,{ useNewUrlParser: true,useUnifiedTopology: true, useFindAndModify: false })
    .then(() => console.log("Connected to the registration database."))
    .catch((err) => console.log(err));


// get secret from .env for token initialization
const secret = process.env.secret;


// Teacher schema
const teacherSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength: 5,
        maxlength:100
    },
    email:{
        type:String,
        required:true,
        unique:true,
        minlength:10,
        maxlength:255
    },
    password:{
        type:String,
        required:true,
        minlength:10,
        maxlength:1024
    },
    isTeacher: Boolean
});

teacherSchema.methods.getAuthToken = function(){
    const token = jwt.sign({
        _id: this.id,
        name: this.name,
        email: this.email,
        isTeacher: this.isTeacher
    }, secret);

    return token;
};

// Develop model based on above schema
const teacherModel = new mongoose.model('teacher',teacherSchema);

async function registerTeacher(name,email,password){

    // check if teacher is already registered
    const isRegistered = await teacherModel.findOne({email:email})
    
    if(isRegistered){
        return "Teacher already registered, try logging in instead."
    }

    // if not registered already, continue with the registration process
    const salt = await bcrypt.genSalt(15);
    const hashedPassword = await bcrypt.hash(password,salt);

    const teacher = new teacherModel({
        name:name,
        email:email,
        password:hashedPassword,
        isTeacher:true
    });
    // save new teacher to the DB
    await teacher.save();

    // generate auth-token
    const token = teacher.getAuthToken()

    const teacherResponse = lodash.pick(teacher,['name','email']);

    return({teacherResponse,token});
};


// Instructor schema

const instructorSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength: 5,
        maxlength:100
    },
    email:{
        type:String,
        required:true,
        unique:true,
        minlength:10,
        maxlength:255
    },
    password:{
        type:String,
        required:true,
        minlength:10,
        maxlength:1024
    },
    isInstructor: Boolean
});

instructorSchema.methods.getAuthToken = function(){
    const token = jwt.sign({
        _id: this.id,
        name: this.name,
        email: this.email,
        isInstructor: this.isInstructor
    }, secret);

    return token;
};

// Initialize instructor model based on above schema
const instructorModel = new mongoose.model('instructor',instructorSchema);

async function registerInstructor(name,email,password){

    // check if instructor is already registered
    const isRegistered = await instructorModel.findOne({email:email})
    
    if(isRegistered){
        return "Instructor already registered, try logging in instead."
    }

    // if not registered already, continue with the registration process
    const salt = await bcrypt.genSalt(15);
    const hashedPassword = await bcrypt.hash(password,salt);

    const instructor = new instructorModel({
        name:name,
        email:email,
        password:hashedPassword,
        isInstructor:true
    });
    // save new teacher to the DB
    await instructor.save();

    // generate auth-token
    const token = instructor.getAuthToken()

    const instructorResponse = lodash.pick(instructor,['name','email']);

    return({instructorResponse,token});
};


// Student schema
const studentSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength: 5,
        maxlength:100
    },
    email:{
        type:String,
        required:true,
        unique:true,
        minlength:10,
        maxlength:255
    },
    password:{
        type:String,
        required:true,
        minlength:10,
        maxlength:1024
    },
    isStudent: Boolean
});

studentSchema.methods.getAuthToken = function(){
    const token = jwt.sign({
        _id: this.id,
        name: this.name,
        email: this.email,
        isStudent: this.isStudent
    }, secret);

    return token;
};

// Develop model based on above schema
const studentModel = new mongoose.model('student',studentSchema);

async function registerStudent(name,email,password){

    // check if teacher is already registered
    const isRegistered = await studentModel.findOne({email:email})
    
    if(isRegistered){
        return "student already registered, try logging in instead."
    }

    // if not registered already, continue with the registration process
    const salt = await bcrypt.genSalt(15);
    const hashedPassword = await bcrypt.hash(password,salt);

    const student = new studentModel({
        name:name,
        email:email,
        password:hashedPassword,
        isStudent:true
    });
    // save new teacher to the DB
    await student.save();

    // generate auth-token
    const token = student.getAuthToken()

    const studentResponse = lodash.pick(student,['name','email']);

    return({studentResponse,token});
};


module.exports = {registerTeacher,registerInstructor,registerStudent,teacherModel,instructorModel,studentModel};