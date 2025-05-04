import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './SubmitAssignment.css'

const SubmitAssignment = () => {
    const [enrolledCourses, setEnrolledCourses] = useState([])
    const [assignments, setAssignments] = useState([])
    const [selectedFiles, setSelectedFiles] = useState({})  // { [assignmentId]: { base64, fileName } }
    const [message, setMessage] = useState('')
    const [submittedAssignments, setSubmittedAssignments] = useState({});
    const stored = localStorage.getItem('userData')
    const studentId = stored ? JSON.parse(stored)._id : null
  
    // File → base64 helper
    const imageTobase64 = file =>
      new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = err => reject(err)
      })
  
    // 1. load enrolled courses
    useEffect(() => {
      if (!studentId) return
      axios
        .get(`http://localhost:5000/student/${studentId}/courses`)
        .then(({ data }) => setEnrolledCourses(data))
        .catch(err => {
          console.error(err)
          setMessage('Could not load your courses.')
        })
    }, [studentId])
  
    // 2. load assignments for each course
    useEffect(() => {
      if (!enrolledCourses.length) return
  
      Promise.all(
        enrolledCourses.map(c =>
          axios.get(`http://localhost:5000/assignments?courseId=${c._id}`)
        )
      )
        .then(resArr => {
          const all = resArr.reduce((acc, { data }) => acc.concat(data), [])
          setAssignments(all)
        })
        .catch(err => {
          console.error(err)
          setMessage('Could not load assignments.')
        })
    }, [enrolledCourses])
  
    // 3. on file select, convert and stash base64+filename
    const handleFileChange = assignmentId => async e => {
      const file = e.target.files[0]
      if (!file) return
  
      try {
        const base64 = await imageTobase64(file)
        setSelectedFiles(f => ({
          ...f,
          [assignmentId]: { base64, fileName: file.name }
        }))
      } catch (err) {
        console.error('Conversion error:', err)
        setMessage('Failed to read the file.')
      }
    }
  
    // 4. on submit, just read from selectedFiles and POST JSON
    const handleSubmit = assignmentId => async () => {
      const fileData = selectedFiles[assignmentId]
      if (!fileData) {
        setMessage('Please pick an image first.')
        return
      }
  
      const payload = {
        assignmentQuestionId: assignmentId,
        studentId,
        answers: [
          {
            image: fileData.base64,
            fileName: fileData.fileName
          }
        ]
      }
  
      try {
        const response = await fetch('http://localhost:5000/assignment-answers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
  
        if (!response.ok) throw new Error('Server error')
  
        setMessage('Upload successful!')
        setSelectedFiles(f => {
          const { [assignmentId]: _, ...rest } = f
          return rest
        })
      } catch (err) {
        console.error('Submission error:', err)
        setMessage('Upload failed.')
      }
    }
  
    // Fetch all submitted answers for the student
    useEffect(() => {
      if (!studentId) return;
  
      axios
        .get(`http://localhost:5000/assignment-answers?studentId=${studentId}`)
        .then(({ data }) => {
          const submittedMap = {};
          data.forEach(submission => {
            submittedMap[submission.assignmentQuestionId] = true;
          });
          setSubmittedAssignments(submittedMap);
        })
        .catch(err => {
          console.error('Error fetching submissions:', err);
        });
    }, [studentId]);
  
    // Filter assignments that have already been submitted
    const unsubmittedAssignments = assignments.filter(a => !submittedAssignments[a._id]);
  
    return (
      <div className="submit-assignment-container">
        <h2>Submit Your Assignments</h2>
        {message && <p className="message">{message}</p>}
  
        {unsubmittedAssignments.length === 0 ? (
          <p>No assignments available to submit.</p>
        ) : (
          unsubmittedAssignments.map(a => (
            <div key={a._id} className="assignment-card">
              <h3>{a.assignmentName}</h3>
              <p>{a.assignmentQuestion}</p>
  
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange(a._id)}
              />
  
              <button onClick={handleSubmit(a._id)}>
                Submit Answer
              </button>
            </div>
          ))
        )}
      </div>
    )
  }
  

export default SubmitAssignment
