import React, { createContext, useState, useContext } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const DataContext = createContext();

  const DataProvider = ({ children }) => {
  const [courseTypes, setCourseTypes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  const addCourseType = (name) => {
    const newType = { id: uuidv4(), name };
    setCourseTypes([...courseTypes, newType]);
    return newType;
  };

  const addCourse = (name, typeId) => {
    const newCourse = { id: uuidv4(), name, typeId };
    setCourses([...courses, newCourse]);
    return newCourse;
  };

  const registerStudent = (courseId, studentName) => {
    const newRegistration = { 
      id: uuidv4(), 
      courseId, 
      studentName 
    };
    setRegistrations([...registrations, newRegistration]);
  };

  const value = {
    courseTypes,
    courses,
    registrations,
    addCourseType,
    addCourse,
    registerStudent
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

const useData = () => useContext(DataContext);

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <div style={styles.navContainer}>
        <h1 style={styles.navTitle}>Course Management System</h1>
        <div style={styles.navLinks}>
          <Link to="/" style={styles.navLink}>Dashboard</Link>
          <Link to="/course-types" style={styles.navLink}>Course Types</Link>
          <Link to="/courses" style={styles.navLink}>Courses</Link>
          <Link to="/registrations" style={styles.navLink}>Registrations</Link>
        </div>
      </div>
    </nav>
  );
};

const Dashboard = () => {
  const { courseTypes, courses, registrations } = useData();

  return (
    <div style={styles.dashboardContainer}>
      <div style={styles.statGrid}>
        {[
          { 
            title: 'Course Types', 
            count: courseTypes.length, 
            color: '#3B82F6', 
            link: '/course-types' 
          },
          { 
            title: 'Courses', 
            count: courses.length, 
            color: '#10B981', 
            link: '/courses' 
          },
          { 
            title: 'Registrations', 
            count: registrations.length, 
            color: '#6366F1', 
            link: '/registrations' 
          }
        ].map((stat, index) => (
          <div key={index} style={{...styles.statCard, borderTopColor: stat.color}}>
            <h3 style={styles.statTitle}>{stat.title}</h3>
            <div style={{...styles.statCount, color: stat.color}}>{stat.count}</div>
            <Link to={stat.link} style={styles.statLink}>Manage</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

const CourseTypePage = () => {
  const [typeName, setTypeName] = useState('');
  const { courseTypes, addCourseType } = useData();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeName.trim()) {
      addCourseType(typeName);
      setTypeName('');
    }
  };

  return (
    <div style={styles.pageContainer}>
      <h2 style={styles.pageTitle}>Course Types</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={typeName}
          onChange={(e) => setTypeName(e.target.value)}
          placeholder="Enter Course Type"
          style={styles.input}
        />
        <button type="submit" style={styles.submitButton}>
          Add Course Type
        </button>
      </form>
      <div style={styles.gridList}>
        {courseTypes.map((type) => (
          <div key={type.id} style={styles.listItem}>
            {type.name}
          </div>
        ))}
      </div>
    </div>
  );
};

const CoursePage = () => {
  const [courseName, setCourseName] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const { courseTypes, courses, addCourse } = useData();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (courseName.trim() && selectedType) {
      addCourse(courseName, selectedType);
      setCourseName('');
      setSelectedType('');
    }
  };

  return (
    <div style={styles.pageContainer}>
      <h2 style={styles.pageTitle}>Courses</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          placeholder="Enter Course Name"
          style={styles.input}
        />
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          style={styles.input}
        >
          <option value="">Select Course Type</option>
          {courseTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
        <button type="submit" style={styles.submitButton}>
          Add Course
        </button>
      </form>
      <div style={styles.gridList}>
        {courses.map((course) => {
          const type = courseTypes.find(t => t.id === course.typeId);
          return (
            <div key={course.id} style={styles.listItem}>
              {course.name} ({type ? type.name : 'No Type'})
            </div>
          );
        })}
      </div>
    </div>
  );
};

const RegistrationPage = () => {
  const [studentName, setStudentName] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const { courseTypes, courses, registrations, registerStudent } = useData();

  const filteredCourses = selectedType 
    ? courses.filter(course => course.typeId === selectedType)
    : courses;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (studentName.trim() && selectedCourse) {
      registerStudent(selectedCourse, studentName);
      setStudentName('');
      setSelectedCourse('');
      setSelectedType('');
    }
  };

  return (
    <div style={styles.pageContainer}>
      <h2 style={styles.pageTitle}>Student Registration</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="Enter Student Name"
          style={styles.input}
        />
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          style={styles.input}
        >
          <option value="">Select Course Type</option>
          {courseTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          style={styles.input}
          disabled={!selectedType}
        >
          <option value="">Select Course</option>
          {filteredCourses.map((course) => {
            const type = courseTypes.find(t => t.id === course.typeId);
            return (
              <option key={course.id} value={course.id}>
                {course.name} ({type.name})
              </option>
            );
          })}
        </select>
        <button type="submit" style={styles.submitButton}>
          Register Student
        </button>
      </form>
      <div style={styles.gridList}>
        {registrations.map((reg) => {
          const course = courses.find(c => c.id === reg.courseId);
          const type = courseTypes.find(t => t.id === course.typeId);
          return (
            <div key={reg.id} style={styles.listItem}>
              {reg.studentName} - {course.name} ({type.name})
            </div>
          );
        })}
      </div>
    </div>
  );
};

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <div style={styles.appContainer}>
          <Navbar />
          <div style={styles.contentContainer}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/course-types" element={<CourseTypePage />} />
              <Route path="/courses" element={<CoursePage />} />
              <Route path="/registrations" element={<RegistrationPage />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </DataProvider>
  );
}

const styles = {
  appContainer: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f4f4f4',
    minHeight: '100vh'
  },
  navbar: {
    backgroundColor: '#3B82F6',
    color: 'white',
    padding: '15px',
    textAlign: 'center'
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  navTitle: {
    margin: 0,
    fontSize: '20px'
  },
  navLinks: {
    display: 'flex',
    gap: '15px'
  },
  navLink: {
    color: 'white',
    textDecoration: 'none'
  },
  dashboardContainer: {
    padding: '20px'
  },
  statGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '15px'
  },
  statCard: {
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '8px',
    textAlign: 'center',
    borderTop: '4px solid'
  },
  statTitle: {
    margin: '0 0 10px 0',
    color: '#666'
  },
  statCount: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '10px 0'
  },
  statLink: {
    color: '#3B82F6',
    textDecoration: 'none'
  },
  pageContainer: {
    backgroundColor: 'white',
    padding: '20px',
    margin: '20px',
    borderRadius: '8px'
  },
  pageTitle: {
    color: '#3B82F6',
    marginBottom: '20px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px'
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px'
  },
  submitButton: {
    backgroundColor: '#10B981',
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  gridList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px'
  },
  listItem: {
    backgroundColor: '#f0f0f0',
    padding: '10px',
    borderRadius: '4px'
  },
  contentContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px'
  }
};

export default App;