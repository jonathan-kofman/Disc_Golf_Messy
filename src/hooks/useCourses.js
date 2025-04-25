import { useState, useEffect } from 'react';

const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load courses from localStorage on initial render
  useEffect(() => {
    try {
      const savedCourses = localStorage.getItem('courses');
      if (savedCourses) {
        const parsedCourses = JSON.parse(savedCourses);
        if (Array.isArray(parsedCourses)) {
          setCourses(parsedCourses);
        }
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      setError('Failed to load courses from storage');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save courses to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('courses', JSON.stringify(courses));
      } catch (error) {
        console.error('Error saving courses:', error);
        setError('Failed to save courses to storage');
      }
    }
  }, [courses, isLoading]);

  const addCourse = (course) => {
    try {
      if (!course || !course.name || !Array.isArray(course.holes)) {
        throw new Error('Invalid course data');
      }

      // Validate course data
      if (course.name.trim() === '') {
        throw new Error('Course name cannot be empty');
      }

      if (course.holes.length === 0) {
        throw new Error('Course must have at least one hole');
      }

      // Validate each hole
      const invalidHoles = course.holes.some(hole => 
        !hole.id || 
        !hole.distance || 
        !hole.par ||
        isNaN(hole.distance) ||
        isNaN(hole.par) ||
        hole.distance <= 0 ||
        hole.par < 1 ||
        hole.par > 7
      );

      if (invalidHoles) {
        throw new Error('Invalid hole data');
      }

      setCourses(prevCourses => [...prevCourses, course]);
      return true;
    } catch (error) {
      console.error('Error adding course:', error);
      setError(error.message);
      return false;
    }
  };

  return {
    courses,
    addCourse,
    isLoading,
    error,
    clearError: () => setError(null)
  };
};

export default useCourses; 