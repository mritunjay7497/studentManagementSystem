// This module provides authentication for Teacher, Instructor and Student

const mongoose = require('mongoose');

const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const {teacherModel,instructorModel,studentModel} = require('../models/registration');

// load local .env file into process.env
dotenv.config();

// get secret for JWT
const secret = process.env.secret;

// get DB URI
const dbURI = process.env.dbURI;

// connect to the DB
mongoose.connect(dbURI, { useNewUrlParser: true,useUnifiedTopology: true, useFindAndModify: false })
    .then(() => console.log("connected to the authentication database"))
    .catch((err) => console.log(err));

// Teacher authentication
async function teacherLogin(email,password){
    // check if teacher exists
    const teacher = await teacherModel.findOne({email:email})
    if(!teacher){
        return "Invalid Email or password. Try again.";
    };

    // If teacher found, comapre plain-text password with hashed password
    const validPassword = await bcrypt.compare(password,teacher.password);

    if(!validPassword){
        return "Invalid Email or password. Try again.";
    };

    const token = teacher.getAuthToken();
    return {token};
};


// Instructor Authentication
async function instructorLogin(email,password){
    // check if instructor exists
    const instructor = await instructorModel.findOne({email:email})
    if(!instructor){
        return "Invalid Email or password. Try again.";
    };

    // If instructor found, comapre plain-text password with hashed password
    const validPassword = await bcrypt.compare(password,instructor.password);

    if(!validPassword){
        return "Invalid Email or password. Try again.";
    };

    const token = instructor.getAuthToken();
    return {token};
};


// Student Athentication
async function studentLogin(email,password){
    // check if student exists
    const student = await studentModel.findOne({email:email})
    if(!student){
        return "Invalid Email or password. Try again.";
    };

    // If student found, comapre plain-text password with hashed password
    const validPassword = await bcrypt.compare(password,student.password);

    if(!validPassword){
        return "Invalid Email or password. Try again.";
    };

    const token = student.getAuthToken();
    return {token};
};

module.exports = {teacherLogin,instructorLogin,studentLogin};