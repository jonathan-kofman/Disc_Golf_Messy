import React, { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, PlusCircle, Trash2, AlertCircle } from 'lucide-react';

const CourseList = ({ courses = [], onStartRound, onAddCourse, onBack, isLoading = false, error = null, onClearError }) => {
  const [newCourseName, setNewCourseName] = useState('');
  const [newHoles, setNewHoles] = useState([{ distance: 250, par: 3 }]);
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear form error when component mounts or when external error is cleared
  useEffect(() => {
    setFormError(null);
  }, [onClearError]);

  const addHole = useCallback(() => {
    setNewHoles(prevHoles => [...prevHoles, { distance: 250, par: 3 }]);
  }, []);

  const updateHole = useCallback((index, field, value) => {
    setNewHoles(prevHoles => {
      const updatedHoles = [...prevHoles];
      updatedHoles[index] = { ...updatedHoles[index], [field]: value };
      return updatedHoles;
    });
  }, []);

  const removeHole = useCallback((index) => {
    if (newHoles.length <= 1) {
      setFormError('Course must have at least one hole');
      return;
    }
    setNewHoles(prevHoles => prevHoles.filter((_, i) => i !== index));
  }, [newHoles.length]);

  const validateHole = (hole) => {
    const distance = parseInt(hole.distance);
    const par = parseInt(hole.par);
    
    if (isNaN(distance) || distance <= 0) {
      return 'Distance must be a positive number';
    }
    if (isNaN(par) || par < 1 || par > 7) {
      return 'Par must be between 1 and 7';
    }
    return null;
  };

  const handleAddCourse = useCallback(async () => {
    setIsSubmitting(true);
    setFormError(null);

    if (newCourseName.trim() === '') {
      setFormError('Please enter a course name');
      setIsSubmitting(false);
      return;
    }
    
    if (newHoles.length === 0) {
      setFormError('Please add at least one hole');
      setIsSubmitting(false);
      return;
    }

    // Validate all holes
    for (const hole of newHoles) {
      const error = validateHole(hole);
      if (error) {
        setFormError(error);
        setIsSubmitting(false);
        return;
      }
    }
    
    const newCourse = {
      id: Date.now(),
      name: newCourseName,
      holes: newHoles.map((hole, index) => ({
        id: index + 1,
        distance: parseInt(hole.distance),
        par: parseInt(hole.par)
      }))
    };
    
    try {
      const success = await onAddCourse(newCourse);
      if (success) {
        setNewCourseName('');
        setNewHoles([{ distance: 250, par: 3 }]);
      }
    } catch (error) {
      setFormError(error.message || 'Failed to save course');
    } finally {
      setIsSubmitting(false);
    }
  }, [newCourseName, newHoles, onAddCourse]);

  // If we're in course creation mode (onBack is provided)
  if (onBack) {
    return (
      <div className="max-w-md mx-auto p-4 bg-gray-100 rounded-lg">
        <div className="flex items-center mb-4">
          <button 
            onClick={onBack}
            className="mr-2 bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition-colors"
            disabled={isSubmitting}
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-xl font-bold">Add New Course</h2>
        </div>

        {(error || formError) && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="mr-2" size={20} />
            {error || formError}
          </div>
        )}

        <div className="bg-white rounded-lg p-4 shadow mb-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
            <input
              type="text"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter course name"
              disabled={isSubmitting}
            />
          </div>
          
          <h3 className="font-medium mb-2">Holes</h3>
          
          {newHoles.map((hole, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <div className="w-8 text-center">
                <span className="text-sm font-medium">{index + 1}</span>
              </div>
              
              <div className="flex-grow">
                <input
                  type="number"
                  value={hole.distance}
                  onChange={(e) => updateHole(index, 'distance', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Distance (ft)"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="w-16">
                <input
                  type="number"
                  value={hole.par}
                  onChange={(e) => updateHole(index, 'par', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Par"
                  min="1"
                  max="7"
                  disabled={isSubmitting}
                />
              </div>
              
              <button 
                onClick={() => removeHole(index)}
                className="text-red-500 hover:text-red-700 transition-colors"
                disabled={isSubmitting}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          
          <div className="flex justify-between mt-4">
            <button 
              onClick={addHole}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded flex items-center text-sm hover:bg-gray-300 transition-colors"
              disabled={isSubmitting}
            >
              <PlusCircle size={16} className="mr-1" /> Add Hole
            </button>
            
            <div className="space-x-2">
              <button 
                onClick={onBack}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              
              <button 
                onClick={handleAddCourse}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Course'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If we're in course list mode
  return (
    <div className="max-w-md mx-auto p-4 bg-gray-100 rounded-lg">
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading courses...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
          <AlertCircle className="mr-2" size={20} />
          {error}
        </div>
      ) : courses.length > 0 ? (
        <div className="space-y-3">
          {courses.map(course => (
            <div key={course.id} className="bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold">{course.name}</h2>
                  <p className="text-sm text-gray-500">{course.holes.length} holes</p>
                </div>
                <button 
                  onClick={() => onStartRound(course)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                >
                  Start Round
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg p-6 shadow text-center">
          <p className="text-gray-500 mb-4">No courses added yet.</p>
          <button 
            onClick={onAddCourse}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Add Your First Course
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseList; 