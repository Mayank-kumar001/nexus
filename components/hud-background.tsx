"use client";

import { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, Environment, Bounds } from "@react-three/drei";
import * as THREE from "three";

export function HudModel() {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/sci-fi_hud_-_quillvr.glb");
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    if (actions && names.length > 0) {
      names.forEach((name) => {
        actions[name]?.reset().fadeIn(0.5).play();
      });
    }
  }, [actions, names]);

  useFrame((state) => {
    if (group.current) {
      // Base rotation to tilt the HUD and angle it, plus a subtle floating effect
      group.current.rotation.x = 1.0 + Math.cos(state.clock.elapsedTime * 0.1) * 0.05;
      group.current.rotation.y = -0.5 + Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
      group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.05) * 0.02;
    }
  });

  return (
    <group ref={group} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/sci-fi_hud_-_quillvr.glb");

export function HudBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#121212]">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 50 }}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={2} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <directionalLight position={[-10, -10, -5]} intensity={1} />
        <Suspense fallback={null}>
          <Environment preset="city" />
          <Bounds fit clip observe margin={1.2}>
            <HudModel />
          </Bounds>
        </Suspense>
      </Canvas>
    </div>
  );
}
