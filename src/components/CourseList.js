import React, { useState } from 'react';
import { ChevronLeft, PlusCircle, Trash2 } from 'lucide-react';

const CourseList = ({ courses = [], onStartRound, onAddCourse, onBack }) => {
  const [newCourseName, setNewCourseName] = useState('');
  const [newHoles, setNewHoles] = useState([{ distance: 250, par: 3 }]);

  const addHole = () => {
    setNewHoles([...newHoles, { distance: 250, par: 3 }]);
  };

  const updateHole = (index, field, value) => {
    const updatedHoles = [...newHoles];
    updatedHoles[index] = { ...updatedHoles[index], [field]: value };
    setNewHoles(updatedHoles);
  };

  const removeHole = (index) => {
    if (newHoles.length <= 1) {
      alert('Course must have at least one hole');
      return;
    }
    const updatedHoles = newHoles.filter((_, i) => i !== index);
    setNewHoles(updatedHoles);
  };

  const handleAddCourse = () => {
    if (newCourseName.trim() === '') {
      alert('Please enter a course name');
      return;
    }
    
    if (newHoles.length === 0) {
      alert('Please add at least one hole');
      return;
    }
    
    const newCourse = {
      id: Date.now(),
      name: newCourseName,
      holes: newHoles.map((hole, index) => ({
        id: index + 1,
        distance: parseInt(hole.distance) || 0,
        par: parseInt(hole.par) || 3
      }))
    };
    
    onAddCourse(newCourse);
    setNewCourseName('');
    setNewHoles([{ distance: 250, par: 3 }]);
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-100 rounded-lg">
      {onBack && (
        <div className="flex items-center mb-4">
          <button 
            onClick={onBack}
            className="mr-2 bg-gray-200 p-2 rounded-full"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-xl font-bold">Add New Course</h2>
        </div>
      )}

      {!onBack ? (
        <>
          {courses.length > 0 ? (
            <div className="space-y-3">
              {courses.map(course => (
                <div key={course.id} className="bg-white rounded-lg p-4 shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-bold">{course.name}</h2>
                      <p className="text-sm text-gray-500">{course.holes.length} holes</p>
                    </div>
                    <button 
                      onClick={() => onStartRound(course)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
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
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add Your First Course
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg p-4 shadow mb-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
            <input
              type="text"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter course name"
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
                  className="w-full p-2 border rounded"
                  placeholder="Distance (ft)"
                />
              </div>
              
              <div className="w-16">
                <input
                  type="number"
                  value={hole.par}
                  onChange={(e) => updateHole(index, 'par', e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Par"
                  min="1"
                  max="7"
                />
              </div>
              
              <button 
                onClick={() => removeHole(index)}
                className="text-red-500"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          
          <div className="flex justify-between mt-4">
            <button 
              onClick={addHole}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded flex items-center text-sm"
            >
              <PlusCircle size={16} className="mr-1" /> Add Hole
            </button>
            
            <div className="space-x-2">
              <button 
                onClick={onBack}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm"
              >
                Cancel
              </button>
              
              <button 
                onClick={handleAddCourse}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
              >
                Save Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseList; 