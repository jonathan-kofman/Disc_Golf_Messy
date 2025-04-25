import { useState, useEffect } from 'react';

const useCourses = () => {
  const [courses, setCourses] = useState([
    { id: 1, name: 'Pine Valley', holes: [
      { id: 1, distance: 250, par: 3 },
      { id: 2, distance: 320, par: 3 },
      { id: 3, distance: 420, par: 4 },
      { id: 4, distance: 280, par: 3 },
      { id: 5, distance: 520, par: 4 }
    ]},
    { id: 2, name: 'Oak Ridge', holes: [
      { id: 1, distance: 280, par: 3 },
      { id: 2, distance: 350, par: 3 },
      { id: 3, distance: 460, par: 4 },
      { id: 4, distance: 210, par: 3 },
      { id: 5, distance: 540, par: 5 }
    ]},
    { id: 3, name: 'Backyard Practice', holes: [
      { id: 1, distance: 20, par: 1 },
      { id: 2, distance: 30, par: 1 },
      { id: 3, distance: 40, par: 1 },
      { id: 4, distance: 50, par: 2 },
      { id: 5, distance: 60, par: 2 }
    ]}
  ]);

  useEffect(() => {
    const savedCourses = localStorage.getItem('courses');
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('courses', JSON.stringify(courses));
  }, [courses]);

  const addCourse = (newCourse) => {
    setCourses([...courses, newCourse]);
  };

  return { courses, addCourse };
};

export default useCourses; 