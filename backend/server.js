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
// Modify this part of the code to use Student instead of StudentProfile



// Example of Express.js backend route
// API Route: Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const student = await Student.findOne({ email });
  
  if (!student) {
      return res.status(400).json({ message: "User not found" });
  }

  // Check if the password matches
  const isPasswordCorrect = password === student.password; // In production, use bcrypt for hashing passwords
  
  if (isPasswordCorrect) {
      // Save customerId to localStorage after successful login
      localStorage.setItem("customerId", student.studentId);  // Assuming studentId is unique
      return res.status(200).json({ message: "Login successful" });
  } else {
      return res.status(400).json({ message: "Invalid credentials" });
  }
});

// API Route: Update Student Profile
app.put('/updateProfile', async (req, res) => {
  const {  firstName, lastName, email, institution, department, password, studentId } = req.body;

  try {
      // Find the student by studentId and update their information
      const updatedStudent = await Student.findOneAndUpdate(
          { studentId }, // Find student by studentId
          { firstName, lastName, email, institution, department, password, studentId }, // Update data
          { new: true } // Return the updated document
      );

      if (!updatedStudent) {
          return res.status(404).json({ message: "Student not found" });
      }

      res.status(200).json({ message: "Profile updated successfully", student: updatedStudent });
  } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Profile update failed" });
  }
});
// API Route: Get Student Profile by StudentId
app.get('/api/student/:studentId', async (req, res) => {
  const { studentId } = req.params;

  try {
      // Find the student by studentId
      const student = await Student.findOne({ studentId });

      if (!student) {
          return res.status(404).json({ message: "Student not found" });
      }

      // Return the student profile information
      res.status(200).json(student);
  } catch (error) {
      console.error("Error fetching student data:", error);
      res.status(500).json({ message: "Error fetching data" });
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
// Update teacher profile
app.put('/teacher/:email', async (req, res) => {
  const { email } = req.params;  // Extract email from URL
  const { firstName, lastName, institution, degree, password } = req.body;

  try {
      const updatedTeacher = await Teacher.findOneAndUpdate(
          { email },  // Find the teacher by email
          { firstName, lastName, institution, degree, password },  // Update teacher data
          { new: true } // Return the updated document
      );

      if (!updatedTeacher) {
          return res.status(404).json({ message: 'Teacher not found' });
      }
      res.status(200).json(updatedTeacher);  // Return the updated teacher's data
  } catch (error) {
      console.error('Error updating teacher:', error);
      res.status(500).json({ message: 'Failed to update teacher profile.' });
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




const UniversitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  details: { type: String, required: true },
  requirements: { type: String, required: true },
  website: { type: String, required: true },
  deadline: { type: Date, required: true },
}, { collection: 'Unilist' });

const University = mongoose.model('University', UniversitySchema);


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

  

  const CountrySchema = new mongoose.Schema({
    name: { type: String, required: true },
    currency: { type: String, required: true },
    costs: {
      accommodation: { type: String, required: true },
      food: { type: String, required: true },
      transport: { type: String, required: true },
      total: { type: String, required: true },
    },
    facilities: [
      {
        name: { type: String, required: true },
        rating: { type: Number, required: true },
      },
    ],
  }, { collection: 'Countries' });
  
  
const Country = mongoose.model('Country', CountrySchema);
// 1. Get all countries
app.get('/countries', async (req, res) => {
  try {
    const countries = await Country.find();
    console.log("Fetched countries:", countries); // Log the fetched data to check the format
    res.json(countries); // Return the array of countries
  } catch (err) {
    console.error("Error fetching countries:", err);
    res.status(500).json({ message: "Failed to load countries" });
  }
});


// 2. Create a new country
app.post('/countries', async (req, res) => {
  const { name, currency, costs, facilities } = req.body;
  const country = new Country({
    name,
    currency,
    costs,
    facilities,
  });

  try {
    const newCountry = await country.save();
    res.status(201).json(newCountry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. Update country by ID
app.put('/countries/:id', async (req, res) => {
  try {
    const updatedCountry = await Country.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCountry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 4. Delete country by ID
app.delete('/countries/:id', async (req, res) => {
  try {
    const deletedCountry = await Country.findByIdAndDelete(req.params.id);
    res.json({ message: 'Country deleted', deletedCountry });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


const liveClassSchema = new mongoose.Schema({
  liveClassName: { type: String, required: true },  // Store the description or link
  instructorName: { type: String, required: true },  // Store the instructor's name
  courseName: { type: String, required: true },      // Store the course name
  classTime: { type: String, required: true },       // Store the class time
}, { collection: 'Liveclass' });

const LiveClass = mongoose.model('LiveClass', liveClassSchema);

// POST endpoint to save live class to database
app.post('/api/liveclass', async (req, res) => {
  const { liveClassName, instructorName, courseName, classTime } = req.body;

  if (!liveClassName || !instructorName || !courseName || !classTime) {
    return res.status(400).send('All fields are required');
  }

  try {
    const newLiveClass = new LiveClass({
      liveClassName,
      instructorName,
      courseName,
      classTime,
    });
    await newLiveClass.save();
    res.status(200).send('Live class saved successfully!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to save live class');
  }
});


app.get('/api/liveclass', async (req, res) => {
  try {
    const liveClasses = await LiveClass.find();
    res.json(liveClasses);
  } catch (error) {
    console.error('Error fetching live classes:', error);
    res.status(500).json({ message: 'Error fetching live classes' });
  }
});


// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
