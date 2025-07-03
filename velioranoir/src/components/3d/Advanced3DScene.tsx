// src/components/3d/Advanced3DScene.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Advanced3DViewerProps {
  className?: string;
  enablePostProcessing?: boolean;
  initialProductType?: string;
  initialMaterial?: string;
}

export default function Advanced3DViewer({ 
  className = '', 
  enablePostProcessing = true,
  initialProductType = 'Ring',
  initialMaterial = 'Silver'
}: Advanced3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const ringRef = useRef<THREE.Mesh | null>(null);
  const animationIdRef = useRef<number | null>(null);
  
  const [material, setMaterial] = useState('Silver');
  const [isMouseDown, setIsMouseDown] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0 });

  const materials = [
    { name: 'Silver', color: 0xC0C0C0, metalness: 0.9, roughness: 0.1 },
    { name: 'Gold', color: 0xFFD700, metalness: 0.8, roughness: 0.05 },
    { name: 'Platinum', color: 0xE5E4E2, metalness: 0.95, roughness: 0.02 },
    { name: 'Copper', color: 0xB87333, metalness: 0.7, roughness: 0.15 },
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffd700, 0.8, 30);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Ring geometry
    const ringGeometry = new THREE.TorusGeometry(1, 0.3, 16, 100);
    
    // Initial material
    const currentMat = materials.find(m => m.name === material) || materials[0];
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: currentMat.color,
      metalness: currentMat.metalness,
      roughness: currentMat.roughness,
      envMapIntensity: 1,
    });

    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.castShadow = true;
    ring.receiveShadow = true;
    scene.add(ring);
    ringRef.current = ring;

    // Add gems
    const gemGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    const gemMaterial = new THREE.MeshStandardMaterial({
      color: 0xff6b9d,
      transparent: true,
      opacity: 0.8,
      metalness: 0,
      roughness: 0,
    });

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const gem = new THREE.Mesh(gemGeometry, gemMaterial);
      gem.position.set(Math.cos(angle) * 1.0, Math.sin(angle) * 1.0, 0);
      ring.add(gem);
    }

    // Mouse controls
    const handleMouseDown = (event: MouseEvent) => {
      setIsMouseDown(true);
      mouseRef.current = { x: event.clientX, y: event.clientY };
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isMouseDown || !ring) return;
      
      const deltaX = event.clientX - mouseRef.current.x;
      const deltaY = event.clientY - mouseRef.current.y;
      
      ring.rotation.y += deltaX * 0.01;
      ring.rotation.x += deltaY * 0.01;
      
      mouseRef.current = { x: event.clientX, y: event.clientY };
    };

    const handleMouseUp = () => {
      setIsMouseDown(false);
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Animation loop
    const animate = () => {
      if (!ring) return;
      
      // Auto rotation when not dragging
      if (!isMouseDown) {
        ring.rotation.y += 0.005;
      }
      
      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
    };
  }, []);

  // Update material when changed
  useEffect(() => {
    if (!ringRef.current) return;
    
    const currentMat = materials.find(m => m.name === material) || materials[0];
    const mesh = ringRef.current as THREE.Mesh;
    const meshMaterial = mesh.material as THREE.MeshStandardMaterial;
    
    meshMaterial.color.setHex(currentMat.color);
    meshMaterial.metalness = currentMat.metalness;
    meshMaterial.roughness = currentMat.roughness;
  }, [material]);

  return (
    <div className={`relative w-full h-[600px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 ${className}`}>
      {/* Three.js Container */}
      <div 
        ref={containerRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none' }}
      />

      {/* Material Controls */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg">
          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium text-gray-700 text-center">Material:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {materials.map((mat) => (
                <button
                  key={mat.name}
                  onClick={() => setMaterial(mat.name)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1 ${
                    material === mat.name
                      ? 'bg-gray-900 text-white shadow-lg scale-105'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <div 
                    className="w-2 h-2 rounded-full border border-white flex-shrink-0"
                    style={{ backgroundColor: `#${mat.color.toString(16).padStart(6, '0')}` }}
                  />
                  <span className="truncate">{mat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
        <p className="text-xs text-gray-600">
          Drag to rotate • Auto-rotating
        </p>
      </div>

      {/* Quality Indicator */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-600">Real-time 3D</span>
        </div>
      </div>
    </div>
  );
}