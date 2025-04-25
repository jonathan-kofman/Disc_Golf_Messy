import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeDScene = ({ sceneUrl }) => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create a simple Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // transparent background
    containerRef.current.appendChild(renderer.domElement);
    
    // Create some disc golf related objects
    // Disc
    const discGeometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
    const discMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x4CAF50,
      wireframe: true
    });
    const disc = new THREE.Mesh(discGeometry, discMaterial);
    disc.position.z = -10;
    scene.add(disc);
    
    // Basket
    const basketTopGeometry = new THREE.TorusGeometry(1.5, 0.1, 8, 24);
    const basketMaterial = new THREE.MeshBasicMaterial({ color: 0x616161, wireframe: true });
    const basketTop = new THREE.Mesh(basketTopGeometry, basketMaterial);
    basketTop.position.set(4, 0, -15);
    basketTop.rotation.x = Math.PI / 2;
    scene.add(basketTop);
    
    // Pole
    const poleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 4, 8);
    const poleMaterial = new THREE.MeshBasicMaterial({ color: 0xBDBDBD, wireframe: true });
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.position.set(4, -2, -15);
    scene.add(pole);
    
    // Add some random trees (simplified as cones)
    for (let i = 0; i < 8; i++) {
      const treeGeometry = new THREE.ConeGeometry(1, 3, 6);
      const treeMaterial = new THREE.MeshBasicMaterial({ color: 0x2E7D32, wireframe: true });
      const tree = new THREE.Mesh(treeGeometry, treeMaterial);
      
      // Random positions around the scene
      const x = Math.random() * 30 - 15;
      const z = Math.random() * -20 - 10;
      tree.position.set(x, -2, z);
      scene.add(tree);
    }
    
    // Position camera
    camera.position.z = 5;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate disc
      disc.rotation.x += 0.005;
      disc.rotation.y += 0.01;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose geometries and materials
      discGeometry.dispose();
      discMaterial.dispose();
      basketTopGeometry.dispose();
      basketMaterial.dispose();
      poleGeometry.dispose();
      poleMaterial.dispose();
    };
  }, [sceneUrl]);
  
  return <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />;
};

export default ThreeDScene;