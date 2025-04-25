import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Plus, Trash2, Save, Share2, Leaf, Sofa, Target, RotateCcw, Ruler, Copy, Download, Upload, Eye, EyeOff, Settings } from 'lucide-react';

const BackyardDesigner = ({ onBack }) => {
  const [selectedTool, setSelectedTool] = useState(null);
  const [courseName, setCourseName] = useState('');
  const [holes, setHoles] = useState([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [measurementMode, setMeasurementMode] = useState(false);
  const [selectedHole, setSelectedHole] = useState(null);
  const [templates, setTemplates] = useState([
    { id: 'basic', name: 'Basic 9-Hole', holes: Array(9).fill().map((_, i) => ({
      id: Date.now() + i,
      name: `Hole ${i + 1}`,
      obstacles: [],
      par: 3,
      distance: 100
    }))},
    { id: 'championship', name: 'Championship 18-Hole', holes: Array(18).fill().map((_, i) => ({
      id: Date.now() + i,
      name: `Hole ${i + 1}`,
      obstacles: [],
      par: i < 6 ? 3 : i < 12 ? 4 : 5,
      distance: i < 6 ? 100 : i < 12 ? 200 : 300
    }))}
  ]);

  const tools = [
    { id: 'tree', icon: <Leaf className="h-6 w-6" />, label: 'Tree', color: 'text-green-600' },
    { id: 'chair', icon: <Sofa className="h-6 w-6" />, label: 'Chair', color: 'text-brown-600' },
    { id: 'target', icon: <Target className="h-6 w-6" />, label: 'Target', color: 'text-red-600' }
  ];

  const handleAddHole = () => {
    const newHole = {
      id: Date.now(),
      name: `Hole ${holes.length + 1}`,
      obstacles: [],
      par: 3,
      distance: 100,
      notes: ''
    };
    setHoles([...holes, newHole]);
  };

  const handleAddObstacle = (holeId, type) => {
    setHoles(holes.map(hole => {
      if (hole.id === holeId) {
        return {
          ...hole,
          obstacles: [...hole.obstacles, { 
            type, 
            id: Date.now(),
            position: { x: 0, y: 0 },
            size: 1,
            rotation: 0
          }]
        };
      }
      return hole;
    }));
  };

  const handleRemoveObstacle = (holeId, obstacleId) => {
    setHoles(holes.map(hole => {
      if (hole.id === holeId) {
        return {
          ...hole,
          obstacles: hole.obstacles.filter(obs => obs.id !== obstacleId)
        };
      }
      return hole;
    }));
  };

  const handleUpdateObstacle = (holeId, obstacleId, updates) => {
    setHoles(holes.map(hole => {
      if (hole.id === holeId) {
        return {
          ...hole,
          obstacles: hole.obstacles.map(obs => 
            obs.id === obstacleId ? { ...obs, ...updates } : obs
          )
        };
      }
      return hole;
    }));
  };

  const handleApplyTemplate = (template) => {
    setHoles(template.holes);
    setCourseName(template.name);
  };

  const handleExportCourse = () => {
    const courseData = {
      name: courseName,
      holes,
      createdAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(courseData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${courseName.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportCourse = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const courseData = JSON.parse(e.target.result);
          setCourseName(courseData.name);
          setHoles(courseData.holes);
        } catch (error) {
          console.error('Error importing course:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const renderHole = (hole) => (
    <div key={hole.id} className="bg-white rounded-lg shadow-lg p-6 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{hole.name}</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Par:</span>
            <input
              type="number"
              min="1"
              max="5"
              value={hole.par}
              onChange={(e) => {
                setHoles(holes.map(h => 
                  h.id === hole.id ? { ...h, par: parseInt(e.target.value) } : h
                ));
              }}
              className="w-12 px-2 py-1 border rounded"
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Distance:</span>
            <input
              type="number"
              min="1"
              value={hole.distance}
              onChange={(e) => {
                setHoles(holes.map(h => 
                  h.id === hole.id ? { ...h, distance: parseInt(e.target.value) } : h
                ));
              }}
              className="w-16 px-2 py-1 border rounded"
            />
            <span className="text-sm text-gray-500">ft</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        {tools.map(tool => (
          <button
            key={tool.id}
            onClick={() => handleAddObstacle(hole.id, tool.id)}
            className={`flex flex-col items-center p-3 border rounded-lg hover:bg-gray-50 ${tool.color}`}
          >
            {tool.icon}
            <span className="text-sm mt-1">{tool.label}</span>
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {hole.obstacles.map(obstacle => {
          const tool = tools.find(t => t.id === obstacle.type);
          return (
            <div key={obstacle.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center space-x-4">
                {tool.icon}
                <span className="ml-2">{tool.label}</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0.1"
                    max="5"
                    step="0.1"
                    value={obstacle.size}
                    onChange={(e) => handleUpdateObstacle(hole.id, obstacle.id, { size: parseFloat(e.target.value) })}
                    className="w-16 px-2 py-1 border rounded"
                    placeholder="Size"
                  />
                  <input
                    type="number"
                    min="0"
                    max="360"
                    value={obstacle.rotation}
                    onChange={(e) => handleUpdateObstacle(hole.id, obstacle.id, { rotation: parseInt(e.target.value) })}
                    className="w-16 px-2 py-1 border rounded"
                    placeholder="Rotation"
                  />
                </div>
              </div>
              <button
                onClick={() => handleRemoveObstacle(hole.id, obstacle.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-4">
        <textarea
          value={hole.notes}
          onChange={(e) => {
            setHoles(holes.map(h => 
              h.id === hole.id ? { ...h, notes: e.target.value } : h
            ));
          }}
          className="w-full px-3 py-2 border rounded"
          placeholder="Add notes about this hole..."
          rows="2"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-6 w-6 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Backyard Course Designer</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            <button
              onClick={() => setMeasurementMode(!measurementMode)}
              className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg"
            >
              <Ruler className="h-4 w-4 mr-2" />
              {measurementMode ? 'Stop Measuring' : 'Measure'}
            </button>
            <button
              onClick={() => setShowSaveDialog(true)}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </button>
            <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </button>
          </div>
        </div>

        <div className="mb-6 flex space-x-4">
          <input
            type="text"
            placeholder="Enter course name..."
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg"
          />
          <select
            onChange={(e) => {
              const template = templates.find(t => t.id === e.target.value);
              if (template) handleApplyTemplate(template);
            }}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">Select Template</option>
            {templates.map(template => (
              <option key={template.id} value={template.id}>{template.name}</option>
            ))}
          </select>
        </div>

        {showPreview && (
          <div className="mb-6 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Course Preview</h3>
            <div className="grid grid-cols-3 gap-4">
              {holes.map(hole => (
                <div key={hole.id} className="border rounded-lg p-4">
                  <h4 className="font-semibold">{hole.name}</h4>
                  <p>Par: {hole.par}</p>
                  <p>Distance: {hole.distance}ft</p>
                  <p>Obstacles: {hole.obstacles.length}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {holes.map(renderHole)}
        </div>

        <div className="mt-4 flex justify-between">
          <button
            onClick={handleAddHole}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Hole
          </button>
          <div className="flex space-x-2">
            <button
              onClick={handleExportCourse}
              className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <label className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Import
              <input
                type="file"
                accept=".json"
                onChange={handleImportCourse}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {showSaveDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Save Course</h3>
              <p className="text-gray-600 mb-4">Your backyard course will be saved and can be accessed later.</p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Save course logic here
                    setShowSaveDialog(false);
                  }}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackyardDesigner; 