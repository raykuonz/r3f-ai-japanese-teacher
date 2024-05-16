"use client";

import { useEffect, useRef } from "react";
import { Canvas, Euler, Vector3 } from "@react-three/fiber";
import {
  CameraControls,
  Environment,
  Float,
  Gltf,
  Html,
} from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";
import { Leva, button, useControls } from "leva";

import { useAiTeacher } from "@/hooks/use-ai-teacher";
import Teacher from "./teacher";
import TypingBox from "./typing-box";
import MessagesList from "./messages-list";
import BoardSettings from "./board-settings";

const CAMERA_POSITIONS = {
  default: [0, 6.123233995736766e-21, 0.0001],
  loading: [
    0.00002621880610890309, 0.00000515037441056466, 0.00009636414192870058,
  ],
  speaking: [0, -1.6481333940859815e-7, 0.00009999846226827279],
};

const CAMERA_ZOOMS = {
  default: 1,
  loading: 1.3,
  speaking: 2.1204819420055387,
};

const ITEMS_PLACEMENT = {
  default: {
    classroom: {
      position: [0.2, -1.7, -2] as Vector3,
    },
    teacher: {
      position: [-1, -1.7, -3] as Vector3,
    },
    board: {
      position: [0.45, 0.382, -6] as Vector3,
    },
  },
  alternative: {
    classroom: {
      position: [0.3, -1.7, -1.5] as Vector3,
      rotation: [0, degToRad(-90), 0] as Euler,
      scale: 0.4,
    },
    teacher: { position: [-1, -1.7, -3] as Vector3 },
    board: { position: [1.4, 0.84, -8] as Vector3 },
  },
};

const CameraManager = () => {

  const controls = useRef<null | CameraControls>(null);

  useControls('Helper', {
    getCameraPosition: button(() => {
      const position = controls?.current?.getPosition(controls?.current?.camera.position);
      const zoom = controls?.current?.camera.zoom;
      // console.log([...position], zoom);
    }),

  });

  const {
    loading,
    currentMessage,
  } = useAiTeacher();

  useEffect(() => {
    if (loading) {
      controls.current?.setPosition(
        CAMERA_POSITIONS.loading[0],
        CAMERA_POSITIONS.loading[1],
        CAMERA_POSITIONS.loading[2],
        true
      );
      controls.current?.zoomTo(CAMERA_ZOOMS.loading, true);
    } else if (currentMessage) {
      controls.current?.setPosition(
        CAMERA_POSITIONS.speaking[0],
        CAMERA_POSITIONS.speaking[1],
        CAMERA_POSITIONS.speaking[2],
        true
      );
      controls.current?.zoomTo(CAMERA_ZOOMS.speaking, true);
    }
  }, [loading, currentMessage])

  return (
    <CameraControls
      ref={controls}
      minZoom={1}
      maxZoom={3}
      polarRotateSpeed={-0.3} // Reverse for natural effect
      azimuthRotateSpeed={-0.3} // Reverse for natural effect
      mouseButtons={{
        left: 1, // Rotate
        wheel: 16, // Zoom,
        middle: 0,
        right: 0,
      }}
      touches={{
        one: 32, // Touch rotate
        two: 512, // Touch zoom
        three: 0,
      }}
    />
  );
}

const Experience = () => {

  const {
    teacher,
    classroom
  } = useAiTeacher();

  return (
    <>
      <Leva hidden />
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
        <ambientLight
          intensity={0.8}
          color="pink"
        />
        <Float
          speed={0.5}
          floatIntensity={0.2}
          rotationIntensity={0.1}
        >
          <Html
            position={ITEMS_PLACEMENT[classroom].board.position}
            transform
            distanceFactor={1}
          >
            <MessagesList />
            <BoardSettings />
          </Html>
          <Teacher
            key={teacher}
            teacher={teacher}
            position={ITEMS_PLACEMENT[classroom].teacher.position}
            scale={1.5}
            rotation-y={degToRad(20)}
          />
          <Gltf
            src={`/models/classroom_${classroom}.glb`}
            {...ITEMS_PLACEMENT[classroom].classroom}
          />
        </Float>
      </Canvas>
      <div className="z-20 justify-center fixed bottom-4 left-4 right-4 flex gap-3 flex-wrap">
        <TypingBox />
      </div>
    </>
  )
}

export default Experience