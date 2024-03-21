"use client";

import { Canvas } from "@react-three/fiber";
import {
  CameraControls,
  Environment,
  Gltf,
  Html,
} from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";

import Teacher from "./teacher";
import TypingBox from "./typing-box";
import MessagesList from "./messages-list";

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
    <>
      <Canvas
        camera={{
          position: [0, 0, 0.0001],
        }}
        className="z-10"
      >
        <CameraManager />
        <Environment
          preset="sunset"
        />
        <Html
          position={[0.22, 0.192, -3]}
          transform
          distanceFactor={0.5}
        >
          <MessagesList />
        </Html>
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
      <div className="z-20 md:justify-center fixed bottom-4 left-4 right-4 flex gap-3 flex-wrap justify-stretch">
        <TypingBox />
      </div>
    </>
  )
}

export default Experience