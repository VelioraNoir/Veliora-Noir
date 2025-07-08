// src/components/3d/ProductModelViewer.tsx - Load Real 3D Models
'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// You'll need to install this: npm install three@latest
// Add to your project: import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface ProductModelViewerProps {
  className?: string;
  modelPath?: string; // Path to your GLB/GLTF file
  initialMaterial?: string;
}

export default function ProductModelViewer({ 
  className = '', 
  modelPath = '/models/ring.glb', // Put your 3D model files in public/models/
  
}: ProductModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const animationIdRef = useRef<number | null>(null);
  
  const [material, setMaterial] = useState('Silver');
  const [isInteracting, setIsInteracting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showParticles, setShowParticles] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const touchRef = useRef({ x: 0, y: 0 });

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
    scene.background = new THREE.Color(0xf8f9fa);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // Enhanced lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(5, 5, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
    fillLight.position.set(-3, 2, 4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffd700, 0.8);
    rimLight.position.set(0, 0, -5);
    scene.add(rimLight);

    // Load 3D Model
    const loadModel = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Dynamic import to avoid SSR issues
        const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
        const loader = new GLTFLoader();

        loader.load(
          modelPath,
          (gltf) => {
            const model = gltf.scene;
            
            // Center and scale the model
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            
            // Scale to fit nicely in view
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 2 / maxDim;
            model.scale.setScalar(scale);
            
            // Center the model
            model.position.x = -center.x * scale;
            model.position.y = -center.y * scale;
            model.position.z = -center.z * scale;

            // Apply initial material to all meshes
            model.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                
                // Apply jewelry material
                const currentMat = materials.find(m => m.name === material) || materials[0];
                child.material = new THREE.MeshStandardMaterial({
                  color: currentMat.color,
                  metalness: currentMat.metalness,
                  roughness: currentMat.roughness,
                  envMapIntensity: 1.5,
                });
              }
            });

            scene.add(model);
            modelRef.current = model;
            setIsLoading(false);
          },
          (progress) => {
            console.log('Loading progress:', (progress.loaded / progress.total) * 100 + '%');
          },
          (error) => {
            console.error('Error loading model:', error);
            setError('Failed to load 3D model. Using fallback...');
            
            // Fallback to simple ring if model fails to load
            createFallbackRing();
            setIsLoading(false);
          }
        );
      } catch (err) {
        console.error('Error importing GLTFLoader:', err);
        setError('3D model loader unavailable. Using fallback...');
        createFallbackRing();
        setIsLoading(false);
      }
    };

    // Fallback ring creation
    const createFallbackRing = () => {
      const ringGeometry = new THREE.TorusGeometry(1, 0.3, 16, 100);
      const currentMat = materials.find(m => m.name === material) || materials[0];
      const ringMaterial = new THREE.MeshStandardMaterial({
        color: currentMat.color,
        metalness: currentMat.metalness,
        roughness: currentMat.roughness,
        envMapIntensity: 1.5,
      });

      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.castShadow = true;
      ring.receiveShadow = true;
      
      // Wrap mesh in a group for consistent API
      const group = new THREE.Group();
      group.add(ring);
      scene.add(group);
      modelRef.current = group;
    };

    loadModel();

    // Enhanced floating particles
    const particleCount = 25;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffd700,
      size: 0.1,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // Controls
    const handleTouchStart = (event: TouchEvent) => {
      setIsInteracting(true);
      const touch = event.touches[0];
      touchRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!isInteracting || !modelRef.current) return;
      
      const touch = event.touches[0];
      const deltaX = touch.clientX - touchRef.current.x;
      const deltaY = touch.clientY - touchRef.current.y;
      
      modelRef.current.rotation.y += deltaX * 0.01;
      modelRef.current.rotation.x += deltaY * 0.01;
      
      touchRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchEnd = () => {
      setIsInteracting(false);
    };

    const handleMouseDown = (event: MouseEvent) => {
      setIsInteracting(true);
      mouseRef.current = { x: event.clientX, y: event.clientY };
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isInteracting || !modelRef.current) return;
      
      const deltaX = event.clientX - mouseRef.current.x;
      const deltaY = event.clientY - mouseRef.current.y;
      
      modelRef.current.rotation.y += deltaX * 0.01;
      modelRef.current.rotation.x += deltaY * 0.01;
      
      mouseRef.current = { x: event.clientX, y: event.clientY };
    };

    const handleMouseUp = () => {
      setIsInteracting(false);
    };

    renderer.domElement.addEventListener('touchstart', handleTouchStart);
    renderer.domElement.addEventListener('touchmove', handleTouchMove);
    renderer.domElement.addEventListener('touchend', handleTouchEnd);
    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Animation loop
    
    const animate = () => {
      
      if (!modelRef.current) return;
      
      // Auto rotation when not interacting
      if (!isInteracting) {
        modelRef.current.rotation.y += 0.005;
      }

      // Animate particles
      if (particles && showParticles) {
        const positions = particles.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          positions[i * 3] += velocities[i * 3];
          positions[i * 3 + 1] += velocities[i * 3 + 1];
          positions[i * 3 + 2] += velocities[i * 3 + 2];
          
          if (Math.abs(positions[i * 3]) > 3) velocities[i * 3] *= -1;
          if (Math.abs(positions[i * 3 + 1]) > 3) velocities[i * 3 + 1] *= -1;
          if (Math.abs(positions[i * 3 + 2]) > 3) velocities[i * 3 + 2] *= -1;
        }
        particles.geometry.attributes.position.needsUpdate = true;
        particles.rotation.y += 0.001;
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
      
      renderer.domElement.removeEventListener('touchstart', handleTouchStart);
      renderer.domElement.removeEventListener('touchmove', handleTouchMove);
      renderer.domElement.removeEventListener('touchend', handleTouchEnd);
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
    if (!modelRef.current) return;
    
    const currentMat = materials.find(m => m.name === material) || materials[0];
    
    // Safe traverse - check if object has traverse method
    if ('traverse' in modelRef.current && typeof modelRef.current.traverse === 'function') {
      modelRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const meshMaterial = child.material as THREE.MeshStandardMaterial;
          meshMaterial.color.setHex(currentMat.color);
          meshMaterial.metalness = currentMat.metalness;
          meshMaterial.roughness = currentMat.roughness;
        }
      });
    } else if (modelRef.current instanceof THREE.Mesh && modelRef.current.material) {
      // Handle single mesh case
      const meshMaterial = modelRef.current.material as THREE.MeshStandardMaterial;
      meshMaterial.color.setHex(currentMat.color);
      meshMaterial.metalness = currentMat.metalness;
      meshMaterial.roughness = currentMat.roughness;
    }
  }, [material]);

  return (
    <div className={`relative w-full h-[600px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 ${className}`}>
      {/* Three.js Container */}
      <div 
        ref={containerRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none' }}
      />

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 backdrop-blur-sm">
          <div className="text-center">
            <div className="luxury-spinner mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Loading 3D model...</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-100 border border-yellow-300 rounded-lg p-3">
          <p className="text-xs text-yellow-800">{error}</p>
        </div>
      )}

      {/* Material Controls */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-xl border border-white/20">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Material:</span>
              <button 
                onClick={() => setShowParticles(!showParticles)}
                className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded border border-gray-200"
              >
                ✨ {showParticles ? 'Hide' : 'Show'} Effects
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {materials.map((mat) => (
                <button
                  key={mat.name}
                  onClick={() => setMaterial(mat.name)}
                  className={`material-button px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                    material === mat.name
                      ? 'bg-gray-900 text-white shadow-lg scale-105 ring-2 ring-gray-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'
                  }`}
                >
                  <div 
                    className="w-3 h-3 rounded-full border border-white/50 flex-shrink-0 shadow-sm"
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
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-lg p-3 shadow-lg">
        <p className="text-xs text-gray-600 flex items-center gap-2">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
          Drag to rotate • Auto-rotating
        </p>
      </div>

      {/* Product Badge */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full animate-pulse"></div>
          <span className="text-gray-700 font-medium">3D Product View</span>
        </div>
      </div>
    </div>
  );
}