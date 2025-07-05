// src/components/3d/Advanced3DScene.tsx - REPLACE ENTIRE FILE
'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { analytics } from '../../lib/analytics';

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
  const particlesRef = useRef<THREE.Points | null>(null);
  const animationIdRef = useRef<number | null>(null);
  
  const [material, setMaterial] = useState('Silver');
  const [isInteracting, setIsInteracting] = useState(false);
  const [showParticles, setShowParticles] = useState(true);
  const mouseRef = useRef({ x: 0, y: 0 });
  const touchRef = useRef({ x: 0, y: 0 });
  
  // Analytics tracking state
  const [sessionStartTime] = useState(Date.now());
  const [totalInteractions, setTotalInteractions] = useState(0);
  const [materialChanges, setMaterialChanges] = useState(0);

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

    // Track 3D viewer initialization
    analytics.trackEvent('3d_viewer_init', {
      viewer_type: 'advanced_3d',
      webgl_supported: !!window.WebGLRenderingContext,
      webgl2_supported: !!window.WebGL2RenderingContext,
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      viewport_size: `${width}x${height}`
    });

    // Scene setup with luxury environment
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f9fa);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5);
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
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // Enhanced lighting for luxury feel
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // Key light (main)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(5, 5, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    scene.add(keyLight);

    // Fill light (softer)
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-3, 2, 4);
    scene.add(fillLight);

    // Rim light for edge definition
    const rimLight = new THREE.DirectionalLight(0xffd700, 0.6);
    rimLight.position.set(0, 0, -5);
    scene.add(rimLight);

    // Environment map for reflections (creates luxury studio look)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envGeometry = new THREE.SphereGeometry(50, 32, 16);
    const envMaterial = new THREE.MeshBasicMaterial({
      color: 0xf0f0f0,
      side: THREE.BackSide
    });
    const envSphere = new THREE.Mesh(envGeometry, envMaterial);
    scene.add(envSphere);

    // Ring geometry
    const ringGeometry = new THREE.TorusGeometry(1, 0.3, 16, 100);
    
    // Initial material with enhanced properties
    const currentMat = materials.find(m => m.name === material) || materials[0];
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: currentMat.color,
      metalness: currentMat.metalness,
      roughness: currentMat.roughness,
      envMapIntensity: 1.5, // Enhanced reflections
    });

    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.castShadow = true;
    ring.receiveShadow = true;
    scene.add(ring);
    ringRef.current = ring;

    // Enhanced gems with inner glow
    const gemGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    const gemMaterial = new THREE.MeshStandardMaterial({
      color: 0xff6b9d,
      transparent: true,
      opacity: 0.9,
      metalness: 0,
      roughness: 0,
      emissive: 0xff6b9d,
      emissiveIntensity: 0.1,
    });

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const gem = new THREE.Mesh(gemGeometry, gemMaterial);
      gem.position.set(Math.cos(angle) * 1.0, Math.sin(angle) * 1.0, 0);
      ring.add(gem);
    }

    // Subtle floating particles (luxury dust)
    const particleCount = 15; // Keep it minimal for performance
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      
      velocities[i * 3] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffd700,
      size: 0.02,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // Gentle ring glow effect
    const glowGeometry = new THREE.TorusGeometry(1.1, 0.35, 16, 100);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: currentMat.color,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide,
    });
    const ringGlow = new THREE.Mesh(glowGeometry, glowMaterial);
    ring.add(ringGlow);

    // TOUCH AND MOUSE CONTROLS WITH ANALYTICS
    const handleTouchStart = (event: TouchEvent) => {
      setIsInteracting(true);
      const touch = event.touches[0];
      touchRef.current = { x: touch.clientX, y: touch.clientY };
      
      // Track touch interaction
      analytics.trackEvent('3d_viewer_touch_start', {
        interaction_type: 'touch',
        device_type: 'mobile'
      });
      setTotalInteractions(prev => prev + 1);
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!isInteracting || !ring) return;
      
      const touch = event.touches[0];
      const deltaX = touch.clientX - touchRef.current.x;
      const deltaY = touch.clientY - touchRef.current.y;
      
      ring.rotation.y += deltaX * 0.01;
      ring.rotation.x += deltaY * 0.01;
      
      touchRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchEnd = () => {
      setIsInteracting(false);
      
      // Track touch interaction end
      analytics.trackEvent('3d_viewer_touch_end', {
        total_interactions: totalInteractions + 1,
        engagement_level: 'active'
      });
    };

    const handleMouseDown = (event: MouseEvent) => {
      setIsInteracting(true);
      mouseRef.current = { x: event.clientX, y: event.clientY };
      
      // Track mouse interaction
      analytics.trackEvent('3d_viewer_mouse_start', {
        interaction_type: 'mouse',
        device_type: 'desktop'
      });
      setTotalInteractions(prev => prev + 1);
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isInteracting || !ring) return;
      
      const deltaX = event.clientX - mouseRef.current.x;
      const deltaY = event.clientY - mouseRef.current.y;
      
      ring.rotation.y += deltaX * 0.01;
      ring.rotation.x += deltaY * 0.01;
      
      mouseRef.current = { x: event.clientX, y: event.clientY };
    };

    const handleMouseUp = () => {
      setIsInteracting(false);
      
      // Track mouse interaction end
      analytics.trackEvent('3d_viewer_mouse_end', {
        total_interactions: totalInteractions + 1,
        engagement_level: 'active'
      });
    };

    renderer.domElement.addEventListener('touchstart', handleTouchStart);
    renderer.domElement.addEventListener('touchmove', handleTouchMove);
    renderer.domElement.addEventListener('touchend', handleTouchEnd);
    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Enhanced animation loop
    let time = 0;
    const animate = () => {
      time += 0.01;
      
      if (!ring) return;
      
      // Auto rotation when not interacting
      if (!isInteracting) {
        ring.rotation.y += 0.005;
      }

      // Animate particles
      if (particles && showParticles) {
        const positions = particles.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          positions[i * 3] += velocities[i * 3];
          positions[i * 3 + 1] += velocities[i * 3 + 1];
          positions[i * 3 + 2] += velocities[i * 3 + 2];
          
          // Boundary check (keep particles in view)
          if (Math.abs(positions[i * 3]) > 4) velocities[i * 3] *= -1;
          if (Math.abs(positions[i * 3 + 1]) > 4) velocities[i * 3 + 1] *= -1;
          if (Math.abs(positions[i * 3 + 2]) > 4) velocities[i * 3 + 2] *= -1;
        }
        particles.geometry.attributes.position.needsUpdate = true;
        
        // Gentle rotation
        particles.rotation.y += 0.001;
      }

      // Subtle glow pulsing
      const glow = ring.children.find(child => 
        child instanceof THREE.Mesh && 
        child.material && 
        (child.material as THREE.Material).transparent
      ) as THREE.Mesh | undefined;
      
      if (glow && glow.material) {
        (glow.material as THREE.MeshBasicMaterial).opacity = 0.05 + Math.sin(time) * 0.03;
      }
      
      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Track 3D viewer load time
    const loadEndTime = Date.now();
    analytics.trackEvent('3d_viewer_load_complete', {
      load_time_ms: loadEndTime - sessionStartTime,
      performance_tier: loadEndTime - sessionStartTime < 1000 ? 'fast' : 'slow'
    });

    // Resize handler
    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      
      // Track resize events for responsive design insights
      analytics.trackEvent('3d_viewer_resize', {
        new_size: `${newWidth}x${newHeight}`,
        device_orientation: newWidth > newHeight ? 'landscape' : 'portrait'
      });
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
      pmremGenerator.dispose();

      // Track 3D viewer session end
      const sessionDuration = Date.now() - sessionStartTime;
      analytics.trackEvent('3d_viewer_session_end', {
        session_duration_ms: sessionDuration,
        total_interactions: totalInteractions,
        material_changes: materialChanges,
        engagement_score: Math.min(100, (totalInteractions * 10) + (materialChanges * 20))
      });
    };
  }, [showParticles]);

  // Update material when changed WITH ANALYTICS
  useEffect(() => {
    if (!ringRef.current) return;
    
    const currentMat = materials.find(m => m.name === material) || materials[0];
    const mesh = ringRef.current as THREE.Mesh;
    const meshMaterial = mesh.material as THREE.MeshStandardMaterial;
    
    meshMaterial.color.setHex(currentMat.color);
    meshMaterial.metalness = currentMat.metalness;
    meshMaterial.roughness = currentMat.roughness;

    // Update glow color
    const glow = mesh.children.find(child => 
      child instanceof THREE.Mesh && 
      child.material && 
      (child.material as THREE.Material).transparent
    ) as THREE.Mesh | undefined;
    
    if (glow && glow.material) {
      (glow.material as THREE.MeshBasicMaterial).color.setHex(currentMat.color);
    }

    // TRACK MATERIAL CHANGE
    analytics.use3DViewer('demo-ring', true);
    analytics.trackEvent('3d_viewer_material_change', {
      old_material: materials.find(m => m.name !== material)?.name || 'unknown',
      new_material: material,
      material_value: getMaterialValue(material),
      customization_engagement: 'high'
    });
    
    setMaterialChanges(prev => prev + 1);
  }, [material, materialChanges]);

  // Helper function to get material value for analytics
  const getMaterialValue = (materialName: string): number => {
    const values = { Silver: 100, Gold: 300, Platinum: 500, Copper: 50 };
    return values[materialName as keyof typeof values] || 100;
  };

  // Handle particle toggle with analytics
  const handleParticleToggle = () => {
    setShowParticles(!showParticles);
    
    analytics.trackEvent('3d_viewer_effects_toggle', {
      effects_enabled: !showParticles,
      user_preference: !showParticles ? 'enhanced_visuals' : 'performance_mode'
    });
  };

  // Handle material selection with analytics
  const handleMaterialChange = (materialName: string) => {
    setMaterial(materialName);
    
    analytics.trackEvent('3d_viewer_material_select', {
      material_selected: materialName,
      selection_method: 'button_click',
      luxury_tier: getMaterialTier(materialName)
    });
  };

  const getMaterialTier = (materialName: string): string => {
    const tiers = { Silver: 'standard', Gold: 'premium', Platinum: 'luxury', Copper: 'affordable' };
    return tiers[materialName as keyof typeof tiers] || 'standard';
  };

  return (
    <div className={`relative w-full h-[600px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 ${className}`}>
      {/* Three.js Container */}
      <div 
        ref={containerRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none' }}
      />

      {/* Enhanced Material Controls */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-xl border border-white/20">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Material:</span>
              <button 
                onClick={handleParticleToggle}
                className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded border border-gray-200"
                data-luxury-action="3d_effects_toggle"
              >
                ✨ {showParticles ? 'Hide' : 'Show'} Effects
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {materials.map((mat) => (
                <button
                  key={mat.name}
                  onClick={() => handleMaterialChange(mat.name)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                    material === mat.name
                      ? 'bg-gray-900 text-white shadow-lg scale-105 ring-2 ring-gray-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'
                  }`}
                  data-luxury-action="3d_material_select"
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

      {/* Luxury Brand Badge */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full animate-pulse"></div>
          <span className="text-gray-700 font-medium">Real-time 3D</span>
        </div>
      </div>

      {/* Interaction Stats (Development mode only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-4 left-4 bg-black/75 text-white text-xs p-2 rounded">
          <div>Interactions: {totalInteractions}</div>
          <div>Material Changes: {materialChanges}</div>
          <div>Session: {Math.round((Date.now() - sessionStartTime) / 1000)}s</div>
        </div>
      )}
    </div>
  );
}