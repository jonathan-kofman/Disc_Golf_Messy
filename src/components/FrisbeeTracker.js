import React, { useState, useEffect } from 'react';
import { ChevronLeft, RotateCcw, Zap, Clock, Target, Map, Disc, Activity } from 'lucide-react';

const FrisbeeTracker = ({ onBack }) => {
  const [frisbeeData, setFrisbeeData] = useState(null);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedFlights, setRecordedFlights] = useState([]);
  const [bluetoothError, setBluetoothError] = useState(null);

  // Simulated connection function - replace with actual Bluetooth connection
  const connectToFrisbee = async () => {
    setIsLoading(true);
    setBluetoothError(null);
    
    try {
      // In a real implementation, you would use Web Bluetooth API
      // navigator.bluetooth.requestDevice({...})
      
      // Simulating a connected device for demonstration
      setTimeout(() => {
        setConnectedDevice({
          name: "Tracker Disc 2000",
          id: "fd:ca:32:87:65:12"
        });
        
        // Start sending simulated data
        startSimulatedDataStream();
        setIsLoading(false);
      }, 1500);
      
    } catch (error) {
      setBluetoothError("Failed to connect to device: " + error.message);
      setIsLoading(false);
    }
  };
  
  // Simulate data coming from the frisbee
  const startSimulatedDataStream = () => {
    const dataInterval = setInterval(() => {
      // Generate realistic frisbee flight data
      const newData = {
        timestamp: new Date().toISOString(),
        acceleration: {
          x: (Math.random() * 2 - 1) * 9.8, // g-forces
          y: (Math.random() * 2 - 1) * 9.8,
          z: (Math.random() * 2 - 1) * 9.8,
        },
        gyroscope: {
          x: Math.random() * 360 - 180, // degrees per second
          y: Math.random() * 360 - 180,
          z: Math.random() * 500 - 250, // spin rate higher on z-axis
        },
        orientation: {
          pitch: Math.random() * 40 - 20, // degrees
          roll: Math.random() * 40 - 20,
        },
        speed: 10 + Math.random() * 15, // mph
        altitude: 1 + Math.random() * 3, // meters above ground
        distance: isRecording ? 
          (recordedFlights.length > 0 ? 
            recordedFlights[recordedFlights.length-1].totalDistance + (Math.random() * 2) : 
            Math.random() * 5) : 
          0,
        battery: 85 - (Math.random() * 5),
      };
      
      setFrisbeeData(newData);
      
      if (isRecording) {
        setRecordedFlights(prev => [...prev, {
          ...newData,
          totalDistance: newData.distance
        }]);
      }
    }, 500); // Update twice per second
    
    // Cleanup interval on component unmount
    return () => clearInterval(dataInterval);
  };
  
  const startRecording = () => {
    setIsRecording(true);
    setRecordedFlights([]);
  };
  
  const stopRecording = () => {
    setIsRecording(false);
    // Here you could save the recorded flight to localStorage
    // similar to how you handle rounds in your disc golf app
  };
  
  const disconnectDevice = () => {
    setConnectedDevice(null);
    setFrisbeeData(null);
    setIsRecording(false);
    // In a real implementation, close the Bluetooth connection
  };
  
  const calculateMaxValues = () => {
    if (!recordedFlights || recordedFlights.length === 0) return null;
    
    let maxSpeed = 0;
    let maxDistance = 0;
    let maxSpin = 0;
    
    recordedFlights.forEach(data => {
      if (data.speed > maxSpeed) maxSpeed = data.speed;
      if (data.distance > maxDistance) maxDistance = data.distance;
      if (Math.abs(data.gyroscope.z) > maxSpin) maxSpin = Math.abs(data.gyroscope.z);
    });
    
    return {
      maxSpeed: maxSpeed.toFixed(1),
      maxDistance: maxDistance.toFixed(1),
      maxSpin: maxSpin.toFixed(0),
      flightTime: (recordedFlights.length * 0.5).toFixed(1), // in seconds, based on our 500ms interval
    };
  };
  
  const renderDeviceStatus = () => (
    <div className="bg-white rounded-lg p-4 shadow mb-4">
      <h2 className="text-lg font-bold mb-3">Device Status</h2>
      
      {!connectedDevice ? (
        <div className="text-center">
          <p className="mb-4">Connect to your frisbee tracker to see flight data</p>
          <button 
            onClick={connectToFrisbee}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
          >
            {isLoading ? 'Connecting...' : 'Connect Device'}
          </button>
          {bluetoothError && (
            <p className="text-red-500 text-sm mt-2">{bluetoothError}</p>
          )}
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="font-bold">{connectedDevice.name}</p>
              <p className="text-xs text-gray-500">{connectedDevice.id}</p>
            </div>
            <div className="flex items-center">
              <div className="mr-3">
                <p className="text-xs text-gray-500">Battery</p>
                <p className="font-bold">{frisbeeData ? `${frisbeeData.battery.toFixed(0)}%` : 'N/A'}</p>
              </div>
              <button 
                onClick={disconnectDevice}
                className="bg-gray-200 hover:bg-gray-300 py-1 px-3 rounded-lg text-sm"
              >
                Disconnect
              </button>
            </div>
          </div>
          
          <div className="flex justify-center space-x-3">
            {!isRecording ? (
              <button 
                onClick={startRecording}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center"
              >
                <Disc className="mr-2 h-5 w-5" /> Start Flight Recording
              </button>
            ) : (
              <button 
                onClick={stopRecording}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg flex items-center"
              >
                <RotateCcw className="mr-2 h-5 w-5" /> Stop Recording
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
  
  const renderLiveData = () => {
    if (!frisbeeData) return null;
    
    return (
      <div className="bg-white rounded-lg p-4 shadow mb-4">
        <h2 className="text-lg font-bold mb-3 flex items-center">
          <Activity className="mr-2 h-5 w-5 text-blue-500" /> Live Data
        </h2>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 p-3 rounded">
            <div className="flex items-center text-blue-700 mb-1">
              <Zap className="h-4 w-4 mr-1" /> Speed
            </div>
            <p className="text-xl font-bold">{frisbeeData.speed.toFixed(1)} mph</p>
          </div>
          
          <div className="bg-green-50 p-3 rounded">
            <div className="flex items-center text-green-700 mb-1">
              <Map className="h-4 w-4 mr-1" /> Distance
            </div>
            <p className="text-xl font-bold">{frisbeeData.distance.toFixed(1)} m</p>
          </div>
          
          <div className="bg-purple-50 p-3 rounded">
            <div className="flex items-center text-purple-700 mb-1">
              <RotateCcw className="h-4 w-4 mr-1" /> Spin Rate
            </div>
            <p className="text-xl font-bold">{Math.abs(frisbeeData.gyroscope.z).toFixed(0)}°/s</p>
          </div>
          
          <div className="bg-yellow-50 p-3 rounded">
            <div className="flex items-center text-yellow-700 mb-1">
              <Target className="h-4 w-4 mr-1" /> Orientation
            </div>
            <p className="text-sm font-bold">
              Pitch: {frisbeeData.orientation.pitch.toFixed(1)}°
              <br />
              Roll: {frisbeeData.orientation.roll.toFixed(1)}°
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  const renderFlightSummary = () => {
    if (!recordedFlights || recordedFlights.length === 0) return null;
    
    const maxValues = calculateMaxValues();
    
    return (
      <div className="bg-white rounded-lg p-4 shadow">
        <h2 className="text-lg font-bold mb-3 flex items-center">
          <Disc className="mr-2 h-5 w-5 text-green-500" /> Flight Summary
        </h2>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 p-3 rounded">
            <p className="text-sm text-blue-700">Max Speed</p>
            <p className="text-xl font-bold">{maxValues.maxSpeed} mph</p>
          </div>
          
          <div className="bg-green-50 p-3 rounded">
            <p className="text-sm text-green-700">Max Distance</p>
            <p className="text-xl font-bold">{maxValues.maxDistance} m</p>
          </div>
          
          <div className="bg-purple-50 p-3 rounded">
            <p className="text-sm text-purple-700">Max Spin Rate</p>
            <p className="text-xl font-bold">{maxValues.maxSpin}°/s</p>
          </div>
          
          <div className="bg-yellow-50 p-3 rounded">
            <p className="text-sm text-yellow-700">Flight Time</p>
            <p className="text-xl font-bold">{maxValues.flightTime} s</p>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <button className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg">
            Save Flight Data
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="max-w-md mx-auto p-4 bg-gray-100 rounded-lg">
      <div className="flex items-center mb-4">
        <button 
          onClick={onBack}
          className="mr-2 bg-gray-200 p-2 rounded-full"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Frisbee Tracker</h1>
      </div>
      
      <div className="space-y-4">
        {renderDeviceStatus()}
        {frisbeeData && renderLiveData()}
        {recordedFlights.length > 0 && renderFlightSummary()}
      </div>
    </div>
  );
};

export default FrisbeeTracker;