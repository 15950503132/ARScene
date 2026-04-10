import React, { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera, Environment } from '@react-three/drei';
import { createXRStore, XR } from '@react-three/xr';
import * as THREE from 'three';
import { STLLoader } from 'three-stdlib';
import { Button } from '@/components/ui/button';
import { Box, Camera } from 'lucide-react';

const store = createXRStore();

function CameraBackground({ enabled }: { enabled: boolean }) {
  const { scene } = useThree();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const textureRef = useRef<THREE.VideoTexture | null>(null);

  useEffect(() => {
    if (!enabled) {
      scene.background = null;
      return;
    }

    const video = document.createElement('video');
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    videoRef.current = video;

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        video.srcObject = stream;
        video.play();
        const texture = new THREE.VideoTexture(video);
        texture.colorSpace = THREE.SRGBColorSpace;
        textureRef.current = texture;
        scene.background = texture;
      })
      .catch((err) => console.error("Camera access denied:", err));

    return () => {
      if (video.srcObject) {
        (video.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
      scene.background = null;
    };
  }, [enabled, scene]);

  return null;
}

interface ModelProps {
  url: string;
  color: string;
  wireframe: boolean;
  opacity: number;
}

function Model({ url, color, wireframe, opacity }: ModelProps) {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    const loader = new STLLoader();
    loader.load(url, (geo) => {
      geo.computeVertexNormals();
      geo.center();
      setGeometry(geo);
    });
  }, [url]);

  if (!geometry) return null;

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial 
        color={color} 
        wireframe={wireframe} 
        transparent={opacity < 1}
        opacity={opacity}
        roughness={0.3}
        metalness={0.8}
      />
    </mesh>
  );
}

interface ModelViewerProps {
  modelUrl: string | null;
  settings: {
    color: string;
    wireframe: boolean;
    opacity: number;
    autoRotate: boolean;
    environment: string;
    cameraBackground: boolean;
  };
}

export function ModelViewer({ modelUrl, settings }: ModelViewerProps) {
  return (
    <div className="w-full h-full relative bg-zinc-950 overflow-hidden">
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-4">
        <Button 
          onClick={() => store.enterAR()}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-6 rounded-full shadow-2xl shadow-emerald-500/20 flex items-center gap-3 group transition-all hover:scale-105 active:scale-95"
        >
          <Camera className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="font-bold tracking-tight uppercase">AR Mode</span>
        </Button>
        <Button 
          onClick={() => store.enterVR()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-6 rounded-full shadow-2xl shadow-blue-500/20 flex items-center gap-3 group transition-all hover:scale-105 active:scale-95"
        >
          <Box className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="font-bold tracking-tight uppercase">VR Mode</span>
        </Button>
      </div>

      <Canvas shadows dpr={[1, 2]}>
        <XR store={store}>
          <Suspense fallback={null}>
            <CameraBackground enabled={settings.cameraBackground} />
            <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
            
            <Stage 
              environment={settings.cameraBackground ? undefined : (settings.environment as any)} 
              intensity={0.5} 
              shadows={{ type: 'contact', opacity: 0.4, blur: 2 } as any}
            >
              {modelUrl && (
                <Model 
                  url={modelUrl} 
                  color={settings.color} 
                  wireframe={settings.wireframe} 
                  opacity={settings.opacity}
                />
              )}
            </Stage>

            <OrbitControls 
              makeDefault 
              autoRotate={settings.autoRotate} 
              autoRotateSpeed={1}
              enableDamping
            />
            
            {!settings.cameraBackground && (
              <Environment preset={settings.environment as any} background blur={0.8} />
            )}
          </Suspense>
        </XR>
      </Canvas>
      
      {!modelUrl && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-zinc-500 text-center space-y-2">
            <p className="text-xl font-light tracking-wider uppercase">No Model Loaded</p>
            <p className="text-sm opacity-60">Upload an STL file to begin visualization</p>
          </div>
        </div>
      )}
    </div>
  );
}
