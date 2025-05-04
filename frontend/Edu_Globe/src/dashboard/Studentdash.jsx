import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../CSS/Studentdash.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import bkash from "../assets/bkash.png";
import nagad from "../assets/nagad.png";

function Student() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [attemptedQuizIds, setAttemptedQuizIds] = useState(new Set());
  const [availableCourses, setAvailableCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const stored = localStorage.getItem("userData");
  const studentId = stored ? JSON.parse(stored)._id : null;
  const [courseQuizzes, setCourseQuizzes] = useState({});
  const [results, setResults] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  // 1. Fetch all courses
  useEffect(() => {
    fetch("http://localhost:5000/courses")
      .then((r) => r.json())
      .then(setAvailableCourses)
      .catch((e) => console.error(e));
  }, []);

  // 2. Fetch enrolled courses
  useEffect(() => {
    if (!studentId) return;
    fetch(`http://localhost:5000/student/${studentId}/courses`)
      .then((r) => r.json())
      .then(setEnrolledCourses)
      .catch((e) => console.error(e));
  }, [studentId]);

  // 3. Fetch quizzes for enrolled courses
  useEffect(() => {
    const fetchQuizzesForCourses = async () => {
      if (!enrolledCourses.length) return;

      const quizzesByCourse = {};

      for (const course of enrolledCourses) {
        try {
          const response = await fetch(
            `http://localhost:5000/course/${course._id}/quizzes`
          );
          if (!response.ok)
            throw new Error(
              `Failed to fetch quizzes for ${course.Course_Name}`
            );

          const quizzes = await response.json();
          quizzesByCourse[course._id] = quizzes;
        } catch (error) {
          console.error(
            `Error fetching quizzes for course ${course._id}:`,
            error
          );
          quizzesByCourse[course._id] = [];
        }
      }
      setCourseQuizzes(quizzesByCourse);
    };

    fetchQuizzesForCourses();
  }, [enrolledCourses]);

  // Fetch available and enrolled courses, and quiz attempts
  useEffect(() => {
    fetch("http://localhost:5000/courses")
      .then((r) => r.json())
      .then(setAvailableCourses)
      .catch(console.error);

    if (studentId) {
      fetch(`http://localhost:5000/student/${studentId}/courses`)
        .then((r) => r.json())
        .then(setEnrolledCourses)
        .catch(console.error);

      fetch(`http://localhost:5000/student/${studentId}/quizAttempts`)
        .then((r) => r.json())
        .then((attemptsFromServer) => {
          setAttempts(attemptsFromServer);
          setAttemptedQuizIds(new Set(attemptsFromServer.map((a) => a.quiz)));
        })
        .catch(console.error);
    }
  }, [studentId]);

  // Derive not enrolled courses
  const notEnrolled = availableCourses.filter(
    (c) => !enrolledCourses.some((ec) => ec._id === c._id)
  );

  const handleEnrollClick = (course) => {
    setSelectedCourse(course);
    setShowPopup(true);
  };

  // Create merged results view when courseQuizzes or attempts change
  useEffect(() => {
    // flatMap through all quizzes by course
    const allQuizzes = Object.values(courseQuizzes).flat();

    // for each attempt, find the matching quiz object
    const merged = attempts
      .map((attempt) => {
        const quizObj = allQuizzes.find((q) => q._id === attempt.quiz);
        if (!quizObj) return null; // no matching quiz yet
        return {
          quizName: quizObj.quizName, // from quizzes
          obtainedMarks: attempt.obtainedMarks, // from attempts
        };
      })
      .filter((x) => x !== null);

    setResults(merged);
  }, [attempts, courseQuizzes]);

  // Fetch announcements for enrolled courses
  useEffect(() => {
    if (!enrolledCourses.length) return;

    const fetchAnnouncements = async () => {
      try {
        const all = [];

        for (const course of enrolledCourses) {
          const res = await fetch(
            `http://localhost:5000/announcements/by-course?courseId=${course._id}`
          );
          if (!res.ok) continue;
          const data = await res.json();
          data.forEach((a) =>
            all.push({
              ...a,
              courseInitial: course.Course_Name, // tag it in the UI
            })
          );
        }

        // sort newest first
        all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setAnnouncements(all);
      } catch (err) {
        console.error("Error fetching announcements:", err);
      }
    };

    fetchAnnouncements();
  }, [enrolledCourses]);

  const navigate = useNavigate();

  const handleTakeQuiz = (quiz) => {
    if (!quiz || !quiz._id) return; // guard against undefined
    navigate("/takequiz", {
      state: {
        quizId: quiz._id,
        quizName: quiz.quizName,
        questions: quiz.questions,
      },
    });
  };

  // Enrollment popup state management
  const [popupStep, setPopupStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [phone, setPhone] = useState("");
  const [enteredAmount, setEnteredAmount] = useState("");
  const [amountError, setAmountError] = useState("");

  const openEnrollFlow = (course) => {
    setSelectedCourse(course);
    setPopupStep(1);
    setEnteredAmount(course.price.toString());
    setAmountError("");
    setPhone("");
    setPaymentMethod(null);
    setShowPopup(true);
  };

  const cancelAll = () => {
    setShowPopup(false);
    setSelectedCourse(null);
    setPopupStep(1);
    setAmountError("");
    setPhone("");
    setPaymentMethod(null);
  };

  const handleStep1Yes = () => {
    setPopupStep(2);
  };

  const choosePayment = (method) => {
    setPaymentMethod(method);
    setPopupStep(3);
  };

  const handleFinalEnroll = async () => {
    if (enteredAmount !== selectedCourse.price.toString()) {
      setAmountError(`Please enter exactly ₹${selectedCourse.price}`);
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:5000/student/${studentId}/courses/${selectedCourse._id}/enroll`,
        { method: "POST", headers: { "Content-Type": "application/json" } }
      );
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || "Enroll failed");
      setEnrolledCourses((ec) => [...ec, selectedCourse]);
      alert("Enrollment successful!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      cancelAll();
    }
  };
 const [adsId, setAdsId] = useState(null);
  // First, update the setSlots state declaration in the component
  const [slots, setSlots] = useState([
    { file: null, preview: null, existing: null },
    { file: null, preview: null, existing: null },
    { file: null, preview: null, existing: null },
  ]);

  // Add these states for the slider functionality
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Update the existing useEffect that fetches ads
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await fetch("http://localhost:5000/ads");
        if (!res.ok) throw new Error("Fetch error");
        const data = await res.json();
        if (data.length > 0) {
          const ad = data[0]; // assume first
          setAdsId(ad._id);
          setSlots([
            {
              file: null,
              preview: ad.image1 || null,
              existing: ad.image1 || null,
            },
            {
              file: null,
              preview: ad.image2 || null,
              existing: ad.image2 || null,
            },
            {
              file: null,
              preview: ad.image3 || null,
              existing: ad.image3 || null,
            },
          ]);
          setIsLoaded(true);
        }
      } catch (err) {
        console.error("Error loading ads:", err);
      }
    };
    fetchAds();
  }, []);

  // Add auto-slide functionality
  useEffect(() => {
    if (!isLoaded) return;

    // Filter out empty slots
    const validSlots = slots.filter((slot) => slot.preview || slot.existing);
    if (validSlots.length <= 1) return; // No need for slider with 0 or 1 image

    const interval = setInterval(() => {
      setCurrentSlide((current) =>
        current === validSlots.length - 1 ? 0 : current + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [slots, isLoaded]);

  // Function to handle manual navigation
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Function to get valid slides
  const getValidSlides = () => {
    return slots.filter((slot) => slot.preview || slot.existing);
  };

  return (
    <div className="student-page">
      {/* Top Navbar */}
      <header className="top-navbar">
        <div className="navbar-left">
          <button
            className="menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span className="hamburger-icon">☰</span>
          </button>
        </div>
        <div className="navbar-center">
          <h1>Student Dashboard</h1>
        </div>
        <div className="navbar-right">
          {/* Optional: Add profile or notification icons here */}
        </div>
      </header>

      {/* Sidebar */}
      <nav className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setSidebarOpen(false)}>
          <span>×</span>
        </button>
        <ul className="sidebar-menu">
          <li>
            <Link to="/studentonline">Live Class</Link>
          </li>
          <li>
            <Link to="/studentprofileedit">Profile</Link>
          </li>
          <li>
            <Link to="/submitassignment">Assiignments</Link>
          </li>
          <li>
            <Link to="/studentassignmentfeedback">Assignment FeedBack</Link>
          </li>
          <li>
            <Link to="/viewrecordedclass">Recorded Class</Link>
          </li>
          <li>
            <Link to="/unilist">Univarsities</Link>
          </li>
          <li>
            <Link to="/countrycom">Countrycom</Link>
          </li>
          <li>
            <Link to="/cretificate">Certificate</Link>
          </li>
          <li>
            <Link
              to="/logout"
              style={{
                backgroundColor: "#ff6b6b",
                color: "white",
                fontWeight: "500",
                transition: "background-color 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#ff5252")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#ff6b6b")}
              onClick={() => {
                localStorage.removeItem("userData");
              }}
            >
              Logout
            </Link>
          </li>
        </ul>
      </nav>

      {/* Main Content - Restructured with better visibility */}
      <div className="main-container">
        {/* Ads Content - ads image slider */}
        <div className="ads-row">
          <div className="slider-container">
            {isLoaded && getValidSlides().length > 0 ? (
              <>
                <div className="slides">
                  {getValidSlides().map((slot, index) => (
                    <div
                      className={`slide ${
                        index === currentSlide ? "active" : ""
                      }`}
                      key={index}
                      style={{
                        backgroundImage: `url(${
                          slot.preview || slot.existing
                        })`,
                        transform: `translateX(${
                          100 * (index - currentSlide)
                        }%)`,
                      }}
                    />
                  ))}
                </div>

                {getValidSlides().length > 1 && (
                  <>
                    <button
                      className="slider-btn prev-btn"
                      onClick={() =>
                        goToSlide(
                          currentSlide === 0
                            ? getValidSlides().length - 1
                            : currentSlide - 1
                        )
                      }
                    >
                      &#10094;
                    </button>
                    <button
                      className="slider-btn next-btn"
                      onClick={() =>
                        goToSlide(
                          currentSlide === getValidSlides().length - 1
                            ? 0
                            : currentSlide + 1
                        )
                      }
                    >
                      &#10095;
                    </button>

                    <div className="dots-container">
                      {getValidSlides().map((_, index) => (
                        <span
                          key={index}
                          className={`dot ${
                            index === currentSlide ? "active" : ""
                          }`}
                          onClick={() => goToSlide(index)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="loading-placeholder">Loading ads...</div>
            )}
          </div>
        </div>

        {/* First row: Available Courses and My Courses - shorter height */}
        <div className="main-container-2col">
          {/* Available Courses */}
          <div className="column box scrollable available-courses">
            <h2>Available Courses</h2>
            {notEnrolled.length > 0 ? (
              notEnrolled.map((course) => (
                <div className="item" key={course._id}>
                  <div>
                    <strong>{course.Course_Name}</strong> – ₹{course.price}
                  </div>
                  <div className="buttons">
                    <button
                      className="add-btn"
                      onClick={() => openEnrollFlow(course)}
                    >
                      Enroll
                    </button>

                    <button className="details-btn">
                      <Link
                        to={`/course/${encodeURIComponent(
                          course.Course_Name
                        )}/studentdash`}
                        className="button-link"
                      >
                        Details
                      </Link>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No courses available for enrollment.</p>
            )}
          </div>
          {/* My Courses */}
          <div className="column box scrollable my-courses">
            <h2>My Courses</h2>
            {enrolledCourses.length > 0 ? (
              enrolledCourses.map((course) => (
                <div className="item" key={course._id}>
                  <span>{course.Course_Name}</span>
                  <div className="buttons">
                    <button className="details-btn">
                      <Link
                        to={`/course/${encodeURIComponent(
                          course.Course_Name
                        )}/studentdash`}
                        className="button-link"
                      >
                        Details
                      </Link>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">
                You are not enrolled in any courses yet.
              </p>
            )}
          </div>
        </div>

        {/* Second row: Announcements */}
        <div className="announcements-row">
          <div className="box announcements-box">
            <h2>Announcements</h2>
            <div className="announcements-list">
              {announcements.length === 0 ? (
                <p className="no-announcements">No announcements yet.</p>
              ) : (
                announcements.map((note, idx) => (
                  <div className="announcement-item" key={idx}>
                    <div
                      className="announcement-course"
                      style={{
                        backgroundColor: "white",
                        fontSize: "1rem",
                      }}
                    >
                      {note.courseName || note.courseInitial}
                    </div>

                    <div className="announcement-title">{note.title}</div>
                    <div className="announcement-content">
                      {note.announcement}
                    </div>
                    {note.createdAt && (
                      <div className="announcement-date">
                        {new Date(note.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Third row: Quizzes and Results side by side */}
        <div className="main-container-2col">
          {/* Quizzes by Course */}
          <div className="column box scrollable">
            <h2>Your Quizzes</h2>
            {enrolledCourses.length > 0 ? (
              enrolledCourses.map((course) => {
                const quizzes = courseQuizzes[course._id] || [];
                return (
                  <div className="course-section" key={course._id}>
                    <h3>{course.Course_Name}</h3>
                    {quizzes.length ? (
                      quizzes.map((quiz) => {
                        const taken = attemptedQuizIds.has(quiz._id);
                        return (
                          <div className="quiz-item" key={quiz._id}>
                            <span>{quiz.quizName}</span>
                            <button
                              className={taken ? "taken-btn" : "take-btn"}
                              onClick={() => handleTakeQuiz(quiz)}
                              disabled={taken}
                            >
                              {taken ? "Already Taken" : "Take Quiz"}
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <p>No quizzes available for this course.</p>
                    )}
                  </div>
                );
              })
            ) : (
              <p>Enroll in courses to see available quizzes.</p>
            )}
          </div>

          {/* Results */}
          <div className="column box scrollable">
            <h2>Results</h2>
            {results.length > 0 ? (
              results.map((result, index) => (
                <div className="result-item" key={index}>
                  <span className="quiz-name">{result.quizName}</span>
                  <span className="marks">{result.obtainedMarks} marks</span>
                </div>
              ))
            ) : (
              <p className="no-data">You haven't attempted any quizzes yet.</p>
            )}
          </div>
        </div>

        {/* Fourth row: Performance Chart */}
        {results.length > 0 && (
          <div className="chart-row">
            <div className="box">
              <h2>Performance Chart</h2>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={results}
                    margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="quizName"
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="obtainedMarks" fill="#6200ea" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Enrollment Confirmation Popup */}
        {showPopup && selectedCourse && (
          <div className="popup-overlay">
            <div className="popup-box">
              {/* STEP 1 */}
              {popupStep === 1 && (
                <>
                  <h3>Confirm Enrollment</h3>
                  <p>
                    Enroll in <strong>{selectedCourse.Course_Name}</strong> for
                    ₹{selectedCourse.price}?
                  </p>
                  <div className="popup-buttons">
                    <button onClick={handleStep1Yes}>Yes, Enroll</button>
                    <button onClick={cancelAll}>Cancel</button>
                  </div>
                </>
              )}

              {/* STEP 2 */}
              {popupStep === 2 && (
                <>
                  <h3>Choose Payment Method</h3>
                  <p>Amount due: ₹{selectedCourse.price}</p>
                  <div className="payment-options">
                    <img
                      src={bkash}
                      alt="Bkash"
                      onClick={() => choosePayment("bkash")}
                      className="payment-icon"
                    />
                    <img
                      src={nagad}
                      alt="Credit Card"
                      onClick={() => choosePayment("nagad")}
                      className="payment-icon"
                    />
                  </div>
                  <button onClick={cancelAll}>Cancel</button>
                </>
              )}

              {/* STEP 3 */}
              {popupStep === 3 && (
                <>
                  <h3>Enter Phone Number & Confirm</h3>
                  <p>
                    You'll pay ₹{selectedCourse.price} via {paymentMethod}.
                  </p>
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder={`Amount (₹${selectedCourse.price})`}
                    value={enteredAmount}
                    onChange={(e) => {
                      setEnteredAmount(e.target.value);
                      if (amountError) setAmountError("");
                    }}
                  />
                  {amountError && <p className="error">{amountError}</p>}
                  <div className="popup-buttons">
                    <button onClick={handleFinalEnroll}>Enroll</button>
                    <button onClick={cancelAll}>Cancel</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Course Details Modal */}
        {showModal && selectedCourse && (
          <div className="modal-overlay">
            <div className="modal">
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
              <h2>{selectedCourse.Course_Name}</h2>
              <p>
                <strong>Credits:</strong> {selectedCourse.Credit}
              </p>
              <p>
                <strong>Price:</strong> ₹{selectedCourse.price}
              </p>
              <p>
                <strong>Schedule:</strong> {selectedCourse.Schedule}
              </p>
              <p>
                <strong>Location:</strong> {selectedCourse.Location}
              </p>
              <p>
                <strong>Prerequisites:</strong>{" "}
                {selectedCourse.Prerequisites || "None"}
              </p>
              <p>
                <strong>Difficulty:</strong> {selectedCourse.Difficulty}
              </p>
              <p>
                <strong>Exam Format:</strong> {selectedCourse.Exam_Format}
              </p>
              <p>
                <strong>Description:</strong> {selectedCourse.Description}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Student;
