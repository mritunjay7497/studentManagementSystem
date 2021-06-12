const app = require('express')();

const instructorRoutes = require('./router/instructor');
const teacherRoutes = require('./router/teacher');
const studentRoutes = require('./router/student');


// Routing middleware for instructor
app.use('/api/instructor',instructorRoutes);

// Routing middleware for teachers
app.use('/api/teacher',teacherRoutes);

// Routing middleware for student
app.use('/api/student',studentRoutes);

// port
const port = process.env.PORT || 3000;
app.listen(port,() => console.log(`Student management server running on port ${port}`));