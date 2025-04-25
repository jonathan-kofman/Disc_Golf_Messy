import { useState, useEffect } from 'react';

const useCourses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const savedCourses = localStorage.getItem('courses');
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('courses', JSON.stringify(courses));
  }, [courses]);

  const addCourse = (course) => {
    setCourses([...courses, course]);
  };

  return {
    courses,
    addCourse
  };
};

export default useCourses; 