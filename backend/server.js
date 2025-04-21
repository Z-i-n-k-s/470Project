const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
// Initialize app
const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/EduMern', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB!");
}).catch((error) => {
    console.error("MongoDB connection error:", error);
});

// Student Schema
const studentSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    institution: String,
    department: String,
    studentId: String,
    password: String
}, {collection: "StudentInformation"});

const Student = mongoose.model('Student', studentSchema);

// API Route: Register Student
app.post('/register', async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        await newStudent.save();
        res.status(201).json({ message: "Student registered successfully!" });
    } catch (error) {
        console.error("Error registering student:", error);
        res.status(500).json({ message: "Registration failed." });
    }
});

// Example of Express.js backend route
// API Route: Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Corrected: Searching for a student, not a User
  const student = await Student.findOne({ email });
  
  if (!student) {
    return res.status(400).json({ message: "User not found" });
  }

  // Check if the password matches
  const isPasswordCorrect = password === student.password; // In production, use hashing libraries like bcrypt
  
  if (isPasswordCorrect) {
    return res.status(200).json({ message: "Login successful" });
  } else {
    return res.status(400).json({ message: "Invalid credentials" });
  }
});








const teacherSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    institution: String,
    degree: String,
    courses: { type: [String], default: [] },
    password: String
}, { collection: "TeacherInformation" });

const Teacher = mongoose.model('Teacher', teacherSchema);

app.post('/teacregister', async (req, res) => {
    console.log('Request body:', req.body);
    try {
        const { firstName, lastName, email, institution, degree, password } = req.body;

        // Create new teacher with default empty courses
        const newTeacher = new Teacher({
            firstName,
            lastName,
            email,
            institution,
            degree,
            password,
            courses: [] // <- Explicitly set to empty array, just for clarity
        });

        await newTeacher.save();
        res.status(201).json({ message: 'Teacher registered successfully!' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Failed to register teacher.' });
    }
});
app.post('/tlogin', async (req, res) => {
  const { email, password } = req.body;

  // Corrected: Searching for a student, not a User
  const teacher = await Teacher.findOne({ email });
  
  if (!teacher) {
    return res.status(400).json({ message: "User not found" });
  }

  // Check if the password matches
  const isPasswordCorrect = password === teacher.password; // In production, use hashing libraries like bcrypt
  
  if (isPasswordCorrect) {
    return res.status(200).json({ message: "Login successful" });
  } else {
    return res.status(400).json({ message: "Invalid credentials" });
  }
});



// Course Schema
// Course Schema
const courseSchema = new mongoose.Schema({
  Course_Name: String,
  Course_Initial: String,
  Credit: Number,
  Department: String,
  Instructor: String,
  Prerequisites: String,
  Description: String,
  Schedule: String,
  Location: String,
  Enrollment: String,
  Difficulty: String,
  Exam_Format: String,
  advanced: { type: Boolean, default: false }  // Added advanced flag to distinguish advanced courses
}, { collection: "Courses" });

const Course = mongoose.model('Course', courseSchema);


// API Route: Get all courses
app.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        console.error('Failed to fetch courses:', error);
        res.status(500).json({ message: 'Failed to fetch courses.' });
    }
});

app.get('/course/:courseName', async (req, res) => {
  try {
      const course = await Course.findOne({ Course_Name: req.params.courseName });
      if (!course) {
          return res.status(404).json({ message: 'Course not found' });
      }
      res.status(200).json(course);
  } catch (error) {
      console.error('Failed to fetch course details:', error);
      res.status(500).json({ message: 'Failed to fetch course details' });
  }
});


app.get('/course/:courseName', async (req, res) => {
  const courseName = req.params.courseName;
  try {
      const course = await CourseCollection.findOne({ Course_Name: courseName });
      if (course) {
          res.json(course);
      } else {
          res.status(404).json({ message: "Course not found" });
      }
  } catch (error) {
      res.status(500).json({ message: "Server error", error });
  }
});


const mongoose = require('mongoose');

const UniversitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  details: { type: String, required: true },
  requirements: { type: String, required: true },
  website: { type: String, required: true },
  deadline: { type: Date, required: true },
}, { collection: 'Unilist' });

module.exports = mongoose.model('University', UniversitySchema);


 // 1. Get all universities
app.get('/universities', async (req, res) => {
    try {
      const universities = await University.find();
      res.json(universities);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // 2. Search universities by country (new endpoint)
  app.get('/universities/search/:country', async (req, res) => {
    try {
      const countryName = req.params.country;
      const universities = await University.find({ country: { $regex: new RegExp(countryName, 'i') } });
      res.json(universities);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // 3. Create a new university
  app.post('/universities', async (req, res) => {
    const { name, country, details, requirements, website, deadline } = req.body;
    const university = new University({ name, country, details, requirements, website, deadline });
  
    try {
      const newUniversity = await university.save();
      res.status(201).json(newUniversity);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // 4. Update a university
  app.put('/universities/:id', async (req, res) => {
    try {
      const updatedUniversity = await University.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedUniversity);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // 5. Delete a university
  app.delete('/universities/:id', async (req, res) => {
    try {
      const deletedUniversity = await University.findByIdAndDelete(req.params.id);
      res.json({ message: 'University deleted', deletedUniversity });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
