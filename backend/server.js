const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
// Initialize app

const PORT = 5000;

const app = express();

// Set limits properly just once
app.use(cors());

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 100000,
  })
);

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://Shimanto:1234@cluster0.0wtaafj.mongodb.net/EduMern?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Connected to MongoDB Server !");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Student Schema
const studentSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    institution: String,
    department: String,
    studentId: String,
    password: String,
  },
  {
    collection: "StudentInformation",
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

// Virtual for courses this student is enrolled in
studentSchema.virtual("enrolledCourses", {
  ref: "Course",
  localField: "_id",
  foreignField: "studentsEnrolled",
});

const Student = mongoose.model("Student", studentSchema);

// GET a single student by ID
app.get("/students/:studentId", async (req, res) => {
  const { studentId } = req.params;

  try {
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (err) {
    console.error("Error fetching student:", err);
    res
      .status(500)
      .json({ message: "Server error while fetching student details" });
  }
});

// API Route: Register Student
app.post("/register", async (req, res) => {
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
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const student = await Student.findOne({ email });

  if (!student) {
    return res.status(400).json({ message: "User not found" });
  }

  // Check if the password matches
  const isPasswordCorrect = password === student.password; // In production, use bcrypt for hashing passwords

  if (isPasswordCorrect) {
    // Save customerId to localStorage after successful login
    // localStorage.setItem("customerId", student.studentId);  // Assuming studentId is unique
    return res.status(200).json({ data: student, message: "Login successful" });
  } else {
    return res.status(400).json({ message: "Invalid credentials" });
  }
});

// API Route: Update Student Profile
app.put("/updateProfile", async (req, res) => {
  // Destructure everything out of the body
  const {
    _id,
    __v,
    firstName,
    lastName,
    email,
    institution,
    department,
    password,
    studentId,
  } = req.body;

  try {
    // Option A: Update by Mongo _id
    const updatedStudent = await Student.findByIdAndUpdate(
      _id,
      {
        firstName,
        lastName,
        email,
        institution,
        department,
        password,
        studentId,
        __v, // you can include __v if you need to bump the version manually
      },
      {
        new: true, // return the updated document
        runValidators: true,
      }
    );

    // // Option B: Update by studentId instead:
    // const updatedStudent = await Student.findOneAndUpdate(
    //   { studentId },
    //   { firstName, lastName, email, institution, department, password },
    //   { new: true, runValidators: true }
    // );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Return both a success message and the full updated student record
    res.status(200).json({
      message: "Profile updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ message: "Profile update failed", error: error.message });
  }
});
// API Route: Get Student Profile by StudentId
app.get("/api/student/:studentId", async (req, res) => {
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

// Get all courses a student is enrolled in
app.get("/student/:studentId/courses", async (req, res) => {
  const { studentId } = req.params;

  try {
    const studentCourses = await Course.find({ studentsEnrolled: studentId });
    res.status(200).json(studentCourses);
  } catch (error) {
    console.error("Error fetching student courses:", error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
});

//student enroll in a course
app.post("/student/:studentId/courses/:courseId/enroll", async (req, res) => {
  const { studentId, courseId } = req.params;
  console.log(studentId);

  try {
    // 1. Load both documents
    const [student, course] = await Promise.all([
      Student.findById(studentId),
      Course.findById(courseId),
    ]);
    if (!student) return res.status(404).json({ message: "Student not found" });
    if (!course) return res.status(404).json({ message: "Course not found" });

    // 2. Enroll student (idempotent)
    await Course.findByIdAndUpdate(courseId, {
      $addToSet: { studentsEnrolled: student._id },
    });

    // 3. Increment teacher revenue by the course price
    await Teacher.findByIdAndUpdate(course.instructor, {
      $inc: { revenue: course.price },
    });

    res.json({ message: "Enrollment successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Enrollment failed", error: err.message });
  }
});
// GET /students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    if (!students.length) {
      return res.status(404).json({ message: "No students found" });
    }
    res.json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ message: "Server error while fetching students" });
  }
});

// Teacher Schema
const teacherSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    institution: String,
    degree: String,
    password: String,
    revenue: {
      type: Number,
      default: 0,
    },
  },
  {
    collection: "TeacherInformation",
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

// Virtual for courses this teacher has created
teacherSchema.virtual("coursesCreated", {
  ref: "Course",
  localField: "_id",
  foreignField: "instructor",
});

const Teacher = mongoose.model("Teacher", teacherSchema);

// GET a single teacher by ID
app.get("/teachers/:teacherId", async (req, res) => {
  const { teacherId } = req.params;

  try {
    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json(teacher);
  } catch (err) {
    console.error("Error fetching teacher:", err);
    res
      .status(500)
      .json({ message: "Server error while fetching teacher details" });
  }
});

// GET /teachers
app.get("/teachers", async (req, res) => {
  try {
    const teachers = await Teacher.find();
    if (!teachers.length) {
      return res.status(404).json({ message: "No teachers found" });
    }
    res.json(teachers);
  } catch (err) {
    console.error("Error fetching teachers:", err);
    res.status(500).json({ message: "Server error while fetching teachers" });
  }
});

app.post("/teacregister", async (req, res) => {
  console.log("Request body:", req.body);
  try {
    const { firstName, lastName, email, institution, degree, password } =
      req.body;

    // Create new teacher with default empty courses
    const newTeacher = new Teacher({
      firstName,
      lastName,
      email,
      institution,
      degree,
      password,
      courses: [], // <- Explicitly set to empty array, just for clarity
    });

    await newTeacher.save();
    res.status(201).json({ message: "Teacher registered successfully!" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Failed to register teacher." });
  }
});
app.post("/tlogin", async (req, res) => {
  const { email, password } = req.body;

  // Corrected: Searching for a student, not a User
  const teacher = await Teacher.findOne({ email });

  if (!teacher) {
    return res.status(400).json({ message: "User not found" });
  }

  // Check if the password matches
  const isPasswordCorrect = password === teacher.password; // In production, use hashing libraries like bcrypt

  if (isPasswordCorrect) {
    return res.status(200).json({ data: teacher, message: "Login successful" });
  } else {
    return res.status(400).json({ message: "Invalid credentials" });
  }
});

// Get all courses created by a teacher
app.get("/teacher/:teacherId/courses", async (req, res) => {
  const { teacherId } = req.params;

  try {
    const courses = await Course.find({ instructor: teacherId });
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching teacher courses:", error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
});

// Update teacher profile by _id
app.put("/teacher/update", async (req, res) => {
  const {
    _id,
    __v,
    firstName,
    lastName,
    email,
    institution,
    degree,
    password,
  } = req.body;

  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      _id,
      {
        firstName,
        lastName,
        email,
        institution,
        degree,
        password,
        __v, // bump version if you like
      },
      { new: true, runValidators: true }
    );

    if (!updatedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      teacher: updatedTeacher,
    });
  } catch (error) {
    console.error("Error updating teacher profile:", error);
    res
      .status(500)
      .json({
        message: "Failed to update teacher profile",
        error: error.message,
      });
  }
});

// Course Schema
const courseSchema = new mongoose.Schema(
  {
    Course_Name: String,
    Course_Initial: String,
    Credit: Number,
    Department: String,
    instructor: {
      // who created it
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    studentsEnrolled: [
      {
        // who’s enrolled
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    Prerequisites: String,
    Description: String,
    Schedule: String,
    Location: String,
    Difficulty: String,
    Exam_Format: String,
    price: {
      // enrollment fee
      type: Number,
      default: 0,
    },
    advanced: {
      type: Boolean,
      default: false,
    },
  },
  { collection: "Courses" }
);

const Course = mongoose.model("Course", courseSchema);

app.post("/teacher/:teacherId/courses", async (req, res) => {
  const { teacherId } = req.params;
  const courseData = {
    ...req.body,
    instructor: teacherId,
  };

  try {
    // 1. Optionally verify teacher exists
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    // 2. Create the course
    const course = await Course.create(courseData);

    res.status(201).json({
      message: "Course created",
      course,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to create course", error: err.message });
  }
});

// API Route: Get all courses
app.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    res.status(500).json({ message: "Failed to fetch courses." });
  }
});

app.get("/course/:courseName", async (req, res) => {
  try {
    const course = await Course.findOne({ Course_Name: req.params.courseName });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(course);
  } catch (error) {
    console.error("Failed to fetch course details:", error);
    res.status(500).json({ message: "Failed to fetch course details" });
  }
});

app.get("/course/:courseName", async (req, res) => {
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

const UniversitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    country: { type: String, required: true },
    details: { type: String, required: true },
    requirements: { type: String, required: true },
    website: { type: String, required: true },
    deadline: { type: Date, required: true },
  },
  { collection: "Unilist" }
);

const University = mongoose.model("University", UniversitySchema);

// 1. Get all universities
app.get("/universities", async (req, res) => {
  try {
    const universities = await University.find();
    res.json(universities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Search universities by country (new endpoint)
app.get("/universities/search/:country", async (req, res) => {
  try {
    const countryName = req.params.country;
    const universities = await University.find({
      country: { $regex: new RegExp(countryName, "i") },
    });
    res.json(universities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. Create a new university
app.post("/universities", async (req, res) => {
  const { name, country, details, requirements, website, deadline } = req.body;
  const university = new University({
    name,
    country,
    details,
    requirements,
    website,
    deadline,
  });

  try {
    const newUniversity = await university.save();
    res.status(201).json(newUniversity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 4. Update a university
app.put("/universities/:id", async (req, res) => {
  try {
    const updatedUniversity = await University.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedUniversity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 5. Delete a university
app.delete("/universities/:id", async (req, res) => {
  try {
    const deletedUniversity = await University.findByIdAndDelete(req.params.id);
    res.json({ message: "University deleted", deletedUniversity });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

const CountrySchema = new mongoose.Schema(
  {
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
  },
  { collection: "Countries" }
);

const Country = mongoose.model("Country", CountrySchema);
// 1. Get all countries
app.get("/countries", async (req, res) => {
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
app.post("/countries", async (req, res) => {
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
app.put("/countries/:id", async (req, res) => {
  try {
    const updatedCountry = await Country.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedCountry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 4. Delete country by ID
app.delete("/countries/:id", async (req, res) => {
  try {
    const deletedCountry = await Country.findByIdAndDelete(req.params.id);
    res.json({ message: "Country deleted", deletedCountry });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

const liveClassSchema = new mongoose.Schema(
  {
    liveClassName: { type: String, required: true }, // Store the description or link
    instructorName: { type: String, required: true }, // Store the instructor's name
    courseName: { type: String, required: true }, // Store the course name
    classTime: { type: String, required: true }, // Store the class time
  },
  { collection: "Liveclass" }
);

const LiveClass = mongoose.model("LiveClass", liveClassSchema);

// POST endpoint to save live class to database
app.post("/api/liveclass", async (req, res) => {
  const { liveClassName, instructorName, courseName, classTime } = req.body;

  if (!liveClassName || !instructorName || !courseName || !classTime) {
    return res.status(400).send("All fields are required");
  }

  try {
    const newLiveClass = new LiveClass({
      liveClassName,
      instructorName,
      courseName,
      classTime,
    });
    await newLiveClass.save();
    res.status(200).send("Live class saved successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to save live class");
  }
});

app.get("/api/liveclass", async (req, res) => {
  try {
    const liveClasses = await LiveClass.find();
    res.json(liveClasses);
  } catch (error) {
    console.error("Error fetching live classes:", error);
    res.status(500).json({ message: "Error fetching live classes" });
  }
});

//Quiz schema

// QuizDefinition schema
const quizDefSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    quizName: {
      type: String,
      required: true,
    },
    questions: [
      {
        text: {
          type: String,
          required: true,
        },
        options: {
          type: [String],
          validate: (opts) => opts.length === 4,
          required: true,
        },
        correctIndex: {
          type: Number,
          min: 0,
          max: 3,
          required: true,
        },
      },
    ],
  },
  {
    collection: "QuizDefinitions",
    timestamps: true,
  }
);

const QuizDefinition = mongoose.model("QuizDefinition", quizDefSchema);

// QuizAttempt schema
const quizAttemptSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuizDefinition",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    answers: [
      {
        // index into the options array for each question
        type: Number,
        min: 0,
        max: 3,
        required: true,
      },
    ],
    obtainedMarks: {
      type: Number,
      min: 0,
      required: true,
    },
    totalMarks: {
      type: Number,
      min: 0,
      required: true,
    },
    attemptedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "QuizAttempts",
    timestamps: true,
  }
);

// one attempt per student per quiz
quizAttemptSchema.index({ quiz: 1, student: 1 }, { unique: true });

const QuizAttempt = mongoose.model("QuizAttempt", quizAttemptSchema);

// POST /teacher/:teacherId/courses/:courseId/quizzes
app.post("/teacher/:teacherId/courses/:courseId/quizzes", async (req, res) => {
  const { teacherId, courseId } = req.params;
  const { name: quizName, questions } = req.body;

  // basic payload validation
  if (!quizName || !Array.isArray(questions) || questions.length === 0) {
    return res
      .status(400)
      .json({ message: "quizName and questions are required" });
  }

  // verify teacher exists
  const teacher = await Teacher.findById(teacherId);
  if (!teacher) {
    return res.status(404).json({ message: "Teacher not found" });
  }

  // verify course exists and belongs to teacher
  const course = await Course.findOne({ _id: courseId, instructor: teacherId });
  if (!course) {
    return res
      .status(404)
      .json({ message: "Course not found or not owned by teacher" });
  }

  // validate each question
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    if (
      typeof q.text !== "string" ||
      !q.text.trim() ||
      !Array.isArray(q.options) ||
      q.options.length !== 4 ||
      q.options.some((opt) => typeof opt !== "string" || !opt.trim()) ||
      typeof q.correctIndex !== "number" ||
      q.correctIndex < 0 ||
      q.correctIndex > 3
    ) {
      return res.status(400).json({
        message: `Invalid data in question ${i + 1}`,
      });
    }
  }

  // create and save
  try {
    const quizDef = new QuizDefinition({
      course: courseId,
      quizName,
      questions,
    });
    await quizDef.save();
    return res
      .status(201)
      .json({ message: "Quiz created", quizId: quizDef._id });
  } catch (err) {
    console.error("Error creating quiz:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// GET all quizzes by course ID
app.get("/course/:courseId/quizzes", async (req, res) => {
  try {
    const courseId = req.params.courseId;

    // Validate courseId format
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID format" });
    }

    // Find all quizzes for this course
    const quizzes = await QuizDefinition.find({ course: courseId });

    // Transform the data for the frontend
    const formattedQuizzes = quizzes.map((quiz) => ({
      _id: quiz._id,
      quizName: quiz.quizName,
      questionCount: quiz.questions.length,
      createdAt: quiz.createdAt,
    }));

    res.json(quizzes);
  } catch (err) {
    console.error("Error fetching quizzes:", err);
    res.status(500).json({ message: "Failed to fetch quizzes" });
  }
});

// Save a student’s attempt
app.post("/quizAttempt", async (req, res) => {
  const { quiz, answers, obtainedMarks,totalMarks } = req.body;
  const student = req.body.student;

  try {
    const attempt = new QuizAttempt({ quiz, student, answers, obtainedMarks ,totalMarks});
    await attempt.save();
    res.status(201).json({ success: true, attempt });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "You have already attempted this quiz." });
    }
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});
app.get("/student/:studentId/quizAttempts", async (req, res) => {
  const { studentId } = req.params;
  console.log(studentId);

  try {
    const attempts = await QuizAttempt.find({ student: studentId })
    res.json(attempts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// 1. Assignment Question Schema
const assignmentQuestionSchema = new mongoose.Schema({
  teacherId: String,
  courseId: String,
  assignmentName: String,
  assignmentQuestion: String,
  createdAt: { type: Date, default: Date.now },
});

// 2. Assignment Answer Schema
const assignmentAnswerSchema = new mongoose.Schema({
  assignmentQuestionId: String,
  studentId: String,
  answers: [
    {
      image: String, // base64 string
      fileName: String, // optional filename
      uploadedAt: { type: Date, default: Date.now },
    },
  ], // Array of base64 image strings
  submittedAt: { type: Date, default: Date.now },
});
// 3. Assignment Feedback Schema
const assignmentFeedbackSchema = new mongoose.Schema({
  assignmentAnswerId: String,
  teacherId: String,
  feedback: String,
  givenAt: { type: Date, default: Date.now },
});

// Register models
const AssignmentQuestion = mongoose.model(
  "AssignmentQuestion",
  assignmentQuestionSchema
);
const AssignmentAnswer = mongoose.model(
  "AssignmentAnswer",
  assignmentAnswerSchema
);
const AssignmentFeedback = mongoose.model(
  "AssignmentFeedback",
  assignmentFeedbackSchema
);

// Create a new assignment
app.post("/assignments", async (req, res) => {
  const { teacherId, courseId, assignmentName, assignmentQuestion } = req.body;

  try {
    // match exactly what your Schema expects
    const assignment = new AssignmentQuestion({
      teacherId,
      courseId,
      assignmentName,
      assignmentQuestion,
    });

    await assignment.save();
    res.status(201).json({ success: true, assignment });
  } catch (err) {
    console.error("Error saving assignment:", err);
    res.status(500).json({ message: "Server error creating assignment." });
  }
});

// GET /assignments?courseId=...
app.get("/assignments", async (req, res) => {
  const { courseId } = req.query;

  if (!courseId) {
    return res.status(400).json({ message: "courseId is required" });
  }

  try {
    const assignments = await AssignmentQuestion.find({ courseId });
    res.json(assignments);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Server error while fetching assignments" });
  }
});
// GET /assignments?courseId=...&teacherId=...
app.get("/assignments-questions", async (req, res) => {
  const { teacherId } = req.query;

  if (!teacherId) {
    return res.status(400).json({ message: " teacherId is required" });
  }

  const filter = {};

  if (teacherId) filter.teacherId = teacherId;

  try {
    const assignments = await AssignmentQuestion.find(filter);
    res.json(assignments);
  } catch (err) {
    console.error("Error fetching assignments:", err);
    res
      .status(500)
      .json({ message: "Server error while fetching assignments" });
  }
});

// POST /assignment-answers
app.post("/assignment-answers", async (req, res) => {
  const { assignmentQuestionId, studentId, answers } = req.body;

  // Basic validation
  if (
    !assignmentQuestionId ||
    !studentId ||
    !answers ||
    !Array.isArray(answers)
  ) {
    return res.status(400).json({ message: "Missing or invalid fields" });
  }

  try {
    // Check for existing submission
    const alreadySubmitted = await AssignmentAnswer.findOne({
      assignmentQuestionId,
      studentId,
    });

    if (alreadySubmitted) {
      return res
        .status(409)
        .json({ message: "You have already submitted this assignment." });
    }

    // Save new submission
    const newSubmission = new AssignmentAnswer({
      assignmentQuestionId,
      studentId,
      answers,
    });

    await newSubmission.save();

    res.status(201).json({ message: "Submission successful" });
  } catch (err) {
    console.error("Error saving submission:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /assignment-answers?studentId=xyz
app.get("/assignment-answers", async (req, res) => {
  try {
    const { studentId } = req.query;
    if (!studentId) {
      return res.status(400).json({ error: "studentId is required" });
    }

    const answers = await AssignmentAnswer.find({ studentId });
    res.json(answers);
  } catch (err) {
    console.error("Error fetching assignment answers:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /assignment-answers?studentId=...&assignmentQuestionId=...
app.get("/assignment-answers-questions", async (req, res) => {
  try {
    const { assignmentQuestionId } = req.query;

    if (!assignmentQuestionId) {
      return res
        .status(400)
        .json({ error: " assignmentQuestionId is required" });
    }

    const filter = {};

    if (assignmentQuestionId)
      filter.assignmentQuestionId = assignmentQuestionId;

    const answers = await AssignmentAnswer.find(filter);
    res.json(answers);
  } catch (err) {
    console.error("Error fetching assignment answers:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
// POST /assignment-feedback
app.post("/assignment-feedback", async (req, res) => {
  const { assignmentAnswerId, teacherId, feedback } = req.body;

  if (!assignmentAnswerId || !teacherId || !feedback) {
    return res
      .status(400)
      .json({
        message: "assignmentAnswerId, teacherId, and feedback are required",
      });
  }

  try {
    const newFeedback = new AssignmentFeedback({
      assignmentAnswerId,
      teacherId,
      feedback,
    });

    await newFeedback.save();
    res.status(201).json({ message: "Feedback saved successfully" });
  } catch (err) {
    console.error("Error saving feedback:", err);
    res.status(500).json({ message: "Server error while saving feedback" });
  }
});
// GET /assignment-feedback?teacherId=...
app.get("/assignment-feedback", async (req, res) => {
  const { teacherId } = req.query;

  if (!teacherId) {
    return res.status(400).json({ message: "teacherId is required" });
  }

  try {
    const feedbacks = await AssignmentFeedback.find({ teacherId });
    res.json(feedbacks);
  } catch (err) {
    console.error("Error fetching feedbacks:", err);
    res.status(500).json({ message: "Server error while fetching feedbacks" });
  }
});
// GET /assignment-feedback/by-answer?assignmentAnswerId=...
app.get("/assignment-feedback/by-answer", async (req, res) => {
  const { assignmentAnswerId } = req.query;

  if (!assignmentAnswerId) {
    return res.status(400).json({ message: "assignmentAnswerId is required" });
  }

  try {
    // find all feedbacks for that answer (usually one)
    const feedbacks = await AssignmentFeedback.find({ assignmentAnswerId });
    if (feedbacks.length === 0) {
      return res
        .status(404)
        .json({ message: "No feedback found for this answer" });
    }
    res.json(feedbacks);
  } catch (err) {
    console.error("Error fetching feedback by answer ID:", err);
    res.status(500).json({ message: "Server error while fetching feedback" });
  }
});

const announcementSchema = new mongoose.Schema({
  teacherId: { type: String, required: true },
  courseId: { type: String, required: true },
  title: { type: String, required: true },
  announcement: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Announcement = mongoose.model("Announcement", announcementSchema);

// GET /announcements/by-teacher?teacherId=...
app.get("/announcements/by-teacher", async (req, res) => {
  const { teacherId } = req.query;

  if (!teacherId) {
    return res.status(400).json({ message: "teacherId is required" });
  }

  try {
    const announcements = await Announcement.find({ teacherId }).sort({
      createdAt: -1,
    });
    if (announcements.length === 0) {
      return res
        .status(404)
        .json({ message: "No announcements found for this teacher" });
    }
    res.json(announcements);
  } catch (err) {
    console.error("Error fetching announcements by teacher ID:", err);
    res
      .status(500)
      .json({ message: "Server error while fetching announcements" });
  }
});

// GET /announcements/by-course?courseId=...
app.get("/announcements/by-course", async (req, res) => {
  const { courseId } = req.query;

  if (!courseId) {
    return res.status(400).json({ message: "courseId is required" });
  }

  try {
    const announcements = await Announcement.find({ courseId }).sort({
      createdAt: -1,
    });
    if (announcements.length === 0) {
      return res
        .status(404)
        .json({ message: "No announcements found for this course" });
    }
    res.json(announcements);
  } catch (err) {
    console.error("Error fetching announcements by course ID:", err);
    res
      .status(500)
      .json({ message: "Server error while fetching announcements" });
  }
});

// POST /announcements
app.post("/announcements", async (req, res) => {
  const { teacherId, courseId, title, announcement } = req.body;

  if (!teacherId || !courseId || !title || !announcement) {
    return res
      .status(400)
      .json({
        message: "teacherId, courseId, title and announcement are all required",
      });
  }

  try {
    const newAnn = new Announcement({
      teacherId,
      courseId,
      title,
      announcement,
    });
    await newAnn.save();
    res.status(201).json(newAnn);
  } catch (err) {
    console.error("Error creating new announcement:", err);
    res.status(500).json({ message: "Server error while saving announcement" });
  }
});

const adsSchema = new mongoose.Schema({
  image1: { type: String },
  image2: { type: String },
  image3: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Ads = mongoose.model("Ads", adsSchema);

// GET /all ads (returns all ads documents, each with up to 3 images)
app.get("/ads", async (req, res) => {
  try {
    const allAds = await Ads.find().sort({ createdAt: -1 });
    res.json(allAds);
  } catch (err) {
    console.error("Error fetching ads:", err);
    res.status(500).json({ message: "Server error fetching ads" });
  }
});

// POST /new ads (expects up to three base64 strings in the body)
app.post("/ads", async (req, res) => {
  const { image1, image2, image3 } = req.body;
  if (!image1 && !image2 && !image3) {
    return res.status(400).json({ message: "At least one image is required" });
  }

  try {
    const newAds = new Ads({ image1, image2, image3 });
    await newAds.save();
    res.status(201).json(newAds);
  } catch (err) {
    console.error("Error creating ads:", err);
    res.status(500).json({ message: "Server error while saving ads" });
  }
});

// Fix for the PUT endpoint to handle empty strings properly
app.put("/ads/:id", async (req, res) => {
  const updates = {};

  // Check for each key in the body, including empty strings
  ["image1", "image2", "image3"].forEach((key) => {
    // Include the field if it exists in request body (even if empty string)
    if (req.body.hasOwnProperty(key)) {
      updates[key] = req.body[key];
    }
  });

  if (Object.keys(updates).length === 0) {
    return res
      .status(400)
      .json({ message: "No image fields provided to update" });
  }

  try {
    const updated = await Ads.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Ads not found" });
    res.json(updated);
  } catch (err) {
    console.error("Error updating ads:", err);
    res.status(500).json({ message: "Server error while updating ads" });
  }
});

// Define Video Schema
const videoSchema = new mongoose.Schema({
  course: { type: String, required: true },

  video: {
    url: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now },
});

// Create the Video model
const Video = mongoose.model("Video", videoSchema);

// GET all videos
app.get("/api/videos", async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    console.error("Error fetching videos:", err);
    res.status(500).json({ message: "Server error while fetching videos" });
  }
});

// GET videos by course
app.get("/api/videos/by-course", async (req, res) => {
  const { course } = req.query;

  if (!course) {
    return res.status(400).json({ message: "Course name is required" });
  }

  try {
    const videos = await Video.find({ course }).sort({ createdAt: -1 });
    if (videos.length === 0) {
      return res
        .status(404)
        .json({ message: "No videos found for this course" });
    }
    res.json(videos);
  } catch (err) {
    console.error("Error fetching videos by course:", err);
    res.status(500).json({ message: "Server error while fetching videos" });
  }
});

// POST a new video
app.post("/api/videos", async (req, res) => {
  const { course, videoUrl } = req.body;

  // Validate the required fields
  if (!course || !videoUrl) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newVideo = new Video({
      course,

      video: { url: videoUrl },
    });

    const savedVideo = await newVideo.save();
    res.status(201).json(savedVideo);
  } catch (err) {
    console.error("Error saving video:", err);
    res.status(500).json({ message: "Server error while saving video" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
