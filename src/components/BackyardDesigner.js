import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, Plus, Trash2, Save, Share2, Leaf, Sofa, Target, 
  RotateCcw, Ruler, Copy, Download, Upload, Eye, EyeOff, Settings,
  Move, Maximize, CornerDownRight, ArrowRight, Wind, 
  Droplets, Mountain, Flag, GripHorizontal, Palmtree, Shrub,
  Snowflake, Umbrella, Shovel, Flower, Webhook, CircleDot
} from 'lucide-react';

const BackyardDesigner = ({ onBack }) => {
  const [selectedTool, setSelectedTool] = useState(null);
  const [courseName, setCourseName] = useState('My Backyard Course');
  const [holes, setHoles] = useState([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [measurementMode, setMeasurementMode] = useState(false);
  const [selectedHole, setSelectedHole] = useState(null);
  const [backyardSize, setBackyardSize] = useState({ width: 50, height: 30 });
  const [grid, setGrid] = useState(true);
  const [gridSize, setGridSize] = useState(5);
  const [scale, setScale] = useState(10); // pixels per foot
  const [dragInfo, setDragInfo] = useState(null);
  const [showDistanceLines, setShowDistanceLines] = useState(true);
  const [windDirection, setWindDirection] = useState(45); // degrees
  const [windSpeed, setWindSpeed] = useState(5); // mph
  const [terrainFeatures, setTerrainFeatures] = useState([]);
  const [currentMeasurement, setCurrentMeasurement] = useState(null);
  const [elevationMode, setElevationMode] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [courseNotes, setCourseNotes] = useState('');
  const [activeDesignMode, setActiveDesignMode] = useState('layout'); // 'layout', 'terrain', 'obstacles'
  const [pathMode, setPathMode] = useState(false);
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState(null);
  
  // Available obstacle types with their icons and properties
  const tools = [
    { id: 'tree', icon: <Palmtree className="h-6 w-6" />, label: 'Tree', color: 'text-green-600', description: 'Large object, blocks shots' },
    { id: 'bush', icon: <Shrub className="h-6 w-6" />, label: 'Bush', color: 'text-green-500', description: 'Small obstacle, can shoot over' },
    { id: 'bench', icon: <Sofa className="h-6 w-6" />, label: 'Bench', color: 'text-amber-700', description: 'Resting spot for players' },
    { id: 'target', icon: <Target className="h-6 w-6" />, label: 'Target', color: 'text-red-600', description: 'Practice target for accuracy' },
    { id: 'water', icon: <Droplets className="h-6 w-6" />, label: 'Water', color: 'text-blue-600', description: 'Water hazard, penalty if ball lands here' },
    { id: 'hill', icon: <Mountain className="h-6 w-6" />, label: 'Hill', color: 'text-stone-600', description: 'Elevation change, affects shot trajectory' },
    { id: 'flag', icon: <Flag className="h-6 w-6" />, label: 'Flag', color: 'text-yellow-600', description: 'Marking for visibility' },
    { id: 'rock', icon: <CircleDot className="h-6 w-6" />, label: 'Rock', color: 'text-gray-600', description: 'Solid obstacle, redirects shots' }
  ];

  // Available terrain types with properties
  const terrainTypes = [
    { id: 'grass', label: 'Grass', color: '#90EE90', friction: 0.8, description: 'Standard surface, normal roll' },
    { id: 'rough', label: 'Rough', color: '#6B8E23', friction: 1.2, description: 'Taller grass, slows ball roll' },
    { id: 'sand', label: 'Sand', color: '#F5DEB3', friction: 1.5, description: 'Bunker, difficult to hit from' },
    { id: 'concrete', label: 'Concrete', color: '#A9A9A9', friction: 0.5, description: 'Fast surface, long roll' },
    { id: 'mulch', label: 'Mulch', color: '#8B4513', friction: 1.3, description: 'Soft surface, absorbs impact' }
  ];

  // Course templates
  const templates = [
    { 
      id: 'basic', 
      name: 'Basic 9-Hole', 
      backyardSize: { width: 50, height: 30 },
      holes: Array(9).fill().map((_, i) => ({
        id: Date.now() + i,
        name: `Hole ${i + 1}`,
        obstacles: [],
        teePosition: { x: 5, y: 5 + (i * 2) },
        holePosition: { x: 40, y: 5 + (i * 2) },
        par: 3,
        distance: 35,
        elevation: 0
      }))
    },
    { 
      id: 'championship', 
      name: 'Championship 18-Hole', 
      backyardSize: { width: 100, height: 60 },
      holes: Array(18).fill().map((_, i) => ({
        id: Date.now() + i,
        name: `Hole ${i + 1}`,
        obstacles: [],
        teePosition: { x: 10, y: 10 + (i * 2) },
        holePosition: { x: 80, y: 10 + (i * 2) },
        par: i < 6 ? 3 : i < 12 ? 4 : 5,
        distance: i < 6 ? 35 : i < 12 ? 45 : 60,
        elevation: Math.floor(i / 6) * 2
      }))
    },
    { 
      id: 'compact', 
      name: 'Compact 3-Hole', 
      backyardSize: { width: 30, height: 20 },
      holes: Array(3).fill().map((_, i) => ({
        id: Date.now() + i,
        name: `Hole ${i + 1}`,
        obstacles: [],
        teePosition: { x: 5, y: 5 + (i * 5) },
        holePosition: { x: 25, y: 5 + (i * 5) },
        par: 3,
        distance: 20,
        elevation: 0
      }))
    }
  ];

  // Initialize with a template on first load
  useEffect(() => {
    if (holes.length === 0) {
      handleApplyTemplate(templates[2]); // Start with compact template
    }
  }, []);

  // Update hole distances when tee or hole positions change
  useEffect(() => {
    const updatedHoles = holes.map(hole => {
      if (hole.teePosition && hole.holePosition) {
        const distance = calculateDistance(hole.teePosition, hole.holePosition);
        return { ...hole, distance: Math.round(distance) };
      }
      return hole;
    });
    setHoles(updatedHoles);
  }, [holes.map(h => `${h.teePosition?.x}-${h.teePosition?.y}-${h.holePosition?.x}-${h.holePosition?.y}`)]);

  const calculateDistance = (point1, point2) => {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
  };

  const handleAddHole = () => {
    // Find the last hole to position the new one
    const lastHole = holes.length > 0 ? holes[holes.length - 1] : null;
    
    const newHole = {
      id: Date.now(),
      name: `Hole ${holes.length + 1}`,
      obstacles: [],
      teePosition: lastHole 
        ? { x: lastHole.teePosition.x, y: lastHole.teePosition.y + 5 }
        : { x: 5, y: 5 },
      holePosition: lastHole
        ? { x: lastHole.holePosition.x, y: lastHole.holePosition.y + 5 }
        : { x: 20, y: 5 },
      par: 3,
      distance: 15,
      notes: '',
      elevation: 0
    };
    setHoles([...holes, newHole]);
  };

  const handleAddObstacle = (holeId, type) => {
    const hole = holes.find(h => h.id === holeId);
    if (!hole) return;
    
    // Position obstacle between tee and hole
    const midPoint = {
      x: (hole.teePosition.x + hole.holePosition.x) / 2,
      y: (hole.teePosition.y + hole.holePosition.y) / 2
    };
    
    setHoles(holes.map(hole => {
      if (hole.id === holeId) {
        return {
          ...hole,
          obstacles: [...hole.obstacles, { 
            type, 
            id: Date.now(),
            position: midPoint,
            size: 1,
            rotation: 0,
            elevation: hole.elevation || 0
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
    setBackyardSize(template.backyardSize);
    setTerrainFeatures([]);
    setPaths([]);
  };

  const handleExportCourse = () => {
    const courseData = {
      name: courseName,
      backyardSize,
      holes,
      terrainFeatures,
      paths,
      settings: {
        windDirection,
        windSpeed,
        grid,
        gridSize
      },
      notes: courseNotes,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
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
          setCourseName(courseData.name || 'Imported Course');
          setHoles(courseData.holes || []);
          if (courseData.backyardSize) setBackyardSize(courseData.backyardSize);
          if (courseData.terrainFeatures) setTerrainFeatures(courseData.terrainFeatures);
          if (courseData.paths) setPaths(courseData.paths || []);
          if (courseData.notes) setCourseNotes(courseData.notes);
          if (courseData.settings) {
            setWindDirection(courseData.settings.windDirection);
            setWindSpeed(courseData.settings.windSpeed);
            setGrid(courseData.settings.grid);
            setGridSize(courseData.settings.gridSize);
          }
        } catch (error) {
          console.error('Error importing course:', error);
          alert('Error importing course. The file may be corrupted or in the wrong format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const setHoleElevation = (holeId, elevation) => {
    setHoles(holes.map(hole => 
      hole.id === holeId 
        ? { ...hole, elevation } 
        : hole
    ));
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
            <span className="w-16 px-2 py-1 border rounded bg-gray-50">{hole.distance || 0}</span>
            <span className="text-sm text-gray-500">ft</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Elevation:</span>
            <input
              type="number"
              min="-10"
              max="20"
              value={hole.elevation || 0}
              onChange={(e) => setHoleElevation(hole.id, parseInt(e.target.value))}
              className="w-16 px-2 py-1 border rounded"
            />
            <span className="text-sm text-gray-500">ft</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col space-y-2 border p-4 rounded-lg">
          <h4 className="font-semibold text-sm">Tee Position</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-500">X:</span>
              <input
                type="number"
                min="0"
                max={backyardSize.width}
                step="0.1"
                value={hole.teePosition?.x.toFixed(1) || 0}
                onChange={(e) => {
                  setHoles(holes.map(h => 
                    h.id === hole.id ? { 
                      ...h, 
                      teePosition: { 
                        ...h.teePosition, 
                        x: parseFloat(e.target.value) 
                      } 
                    } : h
                  ));
                }}
                className="w-full px-2 py-1 border rounded"
              />
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-500">Y:</span>
              <input
                type="number"
                min="0"
                max={backyardSize.height}
                step="0.1"
                value={hole.teePosition?.y.toFixed(1) || 0}
                onChange={(e) => {
                  setHoles(holes.map(h => 
                    h.id === hole.id ? { 
                      ...h, 
                      teePosition: { 
                        ...h.teePosition, 
                        y: parseFloat(e.target.value) 
                      } 
                    } : h
                  ));
                }}
                className="w-full px-2 py-1 border rounded"
              />
            </div>
          </div>
        </div>
        
        <div className="flex flex-col space-y-2 border p-4 rounded-lg">
          <h4 className="font-semibold text-sm">Hole Position</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-500">X:</span>
              <input
                type="number"
                min="0"
                max={backyardSize.width}
                step="0.1"
                value={hole.holePosition?.x.toFixed(1) || 0}
                onChange={(e) => {
                  setHoles(holes.map(h => 
                    h.id === hole.id ? { 
                      ...h, 
                      holePosition: { 
                        ...h.holePosition, 
                        x: parseFloat(e.target.value) 
                      } 
                    } : h
                  ));
                }}
                className="w-full px-2 py-1 border rounded"
              />
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-500">Y:</span>
              <input
                type="number"
                min="0"
                max={backyardSize.height}
                step="0.1"
                value={hole.holePosition?.y.toFixed(1) || 0}
                onChange={(e) => {
                  setHoles(holes.map(h => 
                    h.id === hole.id ? { 
                      ...h, 
                      holePosition: { 
                        ...h.holePosition, 
                        y: parseFloat(e.target.value) 
                      } 
                    } : h
                  ));
                }}
                className="w-full px-2 py-1 border rounded"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold text-sm mb-2">Add Obstacles</h4>
        <div className="grid grid-cols-4 gap-2">
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => handleAddObstacle(hole.id, tool.id)}
              className={`flex flex-col items-center p-2 border rounded-lg hover:bg-gray-50`}
            >
              <div className={tool.color}>
                {tool.icon}
              </div>
              <span className="text-xs mt-1">{tool.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold text-sm mb-2">Obstacles</h4>
        {hole.obstacles.length === 0 && (
          <p className="text-sm text-gray-500 italic">No obstacles added yet.</p>
        )}
        {hole.obstacles.map(obstacle => {
          const tool = tools.find(t => t.id === obstacle.type);
          return (
            <div key={obstacle.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center space-x-4">
                <div className={`${tool?.color || ''}`}>
                  {tool?.icon || obstacle.type}
                </div>
                <span className="ml-2">{tool?.label || obstacle.type}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-500">X:</span>
                  <input
                    type="number"
                    min="0"
                    max={backyardSize.width}
                    step="0.1"
                    value={obstacle.position?.x.toFixed(1) || 0}
                    onChange={(e) => handleUpdateObstacle(hole.id, obstacle.id, { 
                      position: { ...obstacle.position, x: parseFloat(e.target.value) } 
                    })}
                    className="w-16 px-2 py-1 border rounded"
                  />
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-500">Y:</span>
                  <input
                    type="number"
                    min="0"
                    max={backyardSize.height}
                    step="0.1"
                    value={obstacle.position?.y.toFixed(1) || 0}
                    onChange={(e) => handleUpdateObstacle(hole.id, obstacle.id, { 
                      position: { ...obstacle.position, y: parseFloat(e.target.value) } 
                    })}
                    className="w-16 px-2 py-1 border rounded"
                  />
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-500">Size:</span>
                  <input
                    type="number"
                    min="0.1"
                    max="5"
                    step="0.1"
                    value={obstacle.size || 1}
                    onChange={(e) => handleUpdateObstacle(hole.id, obstacle.id, { 
                      size: parseFloat(e.target.value) 
                    })}
                    className="w-16 px-2 py-1 border rounded"
                  />
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-500">Rotation:</span>
                  <input
                    type="number"
                    min="0"
                    max="360"
                    value={obstacle.rotation || 0}
                    onChange={(e) => handleUpdateObstacle(hole.id, obstacle.id, { 
                      rotation: parseInt(e.target.value) 
                    })}
                    className="w-16 px-2 py-1 border rounded"
                  />
                  <span className="text-xs text-gray-500">°</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-500">Elev:</span>
                  <input
                    type="number"
                    min={hole.elevation - 10}
                    max={hole.elevation + 10}
                    value={obstacle.elevation || hole.elevation}
                    onChange={(e) => handleUpdateObstacle(hole.id, obstacle.id, { 
                      elevation: parseInt(e.target.value) 
                    })}
                    className="w-16 px-2 py-1 border rounded"
                  />
                </div>
                <button
                  onClick={() => handleRemoveObstacle(hole.id, obstacle.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4">
        <h4 className="font-semibold text-sm mb-2">Notes</h4>
        <textarea
          value={hole.notes || ''}
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
      <div className="max-w-6xl mx-auto">
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
              onClick={() => setShowDistanceLines(!showDistanceLines)}
              className={`flex items-center px-4 py-2 ${showDistanceLines ? 'bg-purple-500' : 'bg-gray-500'} text-white rounded-lg`}
            >
              <Ruler className="h-4 w-4 mr-2" />
              {showDistanceLines ? 'Hide Distances' : 'Show Distances'}
            </button>
            <button
              onClick={() => setShowSaveDialog(true)}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4">
          <div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">Course Name</label>
              <input
                type="text"
                placeholder="Enter course name..."
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Backyard Width (ft)</label>
                <input
                  type="number"
                  min="10"
                  max="200"
                  value={backyardSize.width}
                  onChange={(e) => setBackyardSize({...backyardSize, width: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Backyard Height (ft)</label>
                <input
                  type="number"
                  min="10"
                  max="200"
                  value={backyardSize.height}
                  onChange={(e) => setBackyardSize({...backyardSize, height: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Template</label>
            <select
              onChange={(e) => {
                const template = templates.find(t => t.id === e.target.value);
                if (template) handleApplyTemplate(template);
              }}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Select Template</option>
              {templates.map(template => (
                <option key={template.id} value={template.id}>{template.name}</option>
              ))}
            </select>
            <div className="mt-2 flex space-x-2">
              <button
                onClick={handleExportCourse}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-500 text-white rounded-lg"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
              <label className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-500 text-white rounded-lg cursor-pointer">
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
        </div>

        {/* Course Notes */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Course Notes</label>
          <textarea
            value={courseNotes}
            onChange={(e) => setCourseNotes(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Add general notes about the course..."
            rows="2"
          />
        </div>
        
        {/* Environmental Factors */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3">Environmental Factors</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Wind Speed</label>
              <div className="flex items-center">
                <Wind className="h-5 w-5 text-gray-600 mr-2" />
                <input 
                  type="number" 
                  min="0" 
                  max="30" 
                  value={windSpeed} 
                  onChange={(e) => setWindSpeed(parseInt(e.target.value))} 
                  className="w-16 border rounded px-2 py-1"
                />
                <span className="ml-1 text-sm text-gray-500">mph</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Wind Direction</label>
              <div className="flex items-center">
                <input 
                  type="range" 
                  min="0" 
                  max="359" 
                  value={windDirection} 
                  onChange={(e) => setWindDirection(parseInt(e.target.value))} 
                  className="w-32 mr-2"
                />
                <div 
                  className="w-8 h-8 border rounded-full flex items-center justify-center"
                  style={{ transform: `rotate(${windDirection}deg)` }}
                >
                  <ArrowRight className="h-4 w-4 text-gray-600" />
                </div>
                <span className="ml-2 text-sm text-gray-500">{windDirection}°</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Settings</label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowDistanceLines(!showDistanceLines)}
                  className={`px-3 py-1 rounded text-sm ${showDistanceLines ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                >
                  {showDistanceLines ? 'Hide Distances' : 'Show Distances'}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Holes */}
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
        </div>

        {showSaveDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Save Course</h3>
              <p className="text-gray-600 mb-4">Your backyard course will be saved as a JSON file that you can reload later.</p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleExportCourse();
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