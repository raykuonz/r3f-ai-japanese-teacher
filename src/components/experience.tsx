"use client";

import { Canvas } from "@react-three/fiber";
import {
  CameraControls,
  Environment,
  Gltf,
} from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";

import Teacher from "./teacher";

const CameraManager = () => {
  return (
    <CameraControls
      minZoom={1}
      maxZoom={3}
      polarRotateSpeed={-0.3} // Reverse for natural effect
      azimuthRotateSpeed={-0.3} // Reverse for natural effect
      mouseButtons={{
        left: 1, // Rotate
        wheel: 16, // Zooom
      }}
      touches={{
        one: 32, // Touch rotate
        two: 512, // Touch zoom
      }}
    />
  );
}

const Experience = () => {
  return (
    <Canvas
      camera={{
        position: [0, 0, 0.0001],
      }}
    >
      <CameraManager />
      <Environment
        preset="sunset"
      />
      <ambientLight
        intensity={0.8}
        color="pink"
      />
      <Teacher
        teacher="Nanami"
        position={[-1, -1.7, -3]}
        scale={1.5}
        rotation-y={degToRad(20)}
      />
      <Gltf
        src="/models/classroom_default.glb"
        position={[0.2, -1.7, -2]}
      />
    </Canvas>
  )
}

export default Experience