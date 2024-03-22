"use client";

import { useEffect, useState } from 'react'
import { MathUtils } from 'three';
import { randInt } from 'three/src/math/MathUtils.js';
import { useGLTF } from '@react-three/drei'
import { GroupProps, useFrame } from '@react-three/fiber';

import { TEACHERS } from '@/libs/constants';
import { TeacherType } from '@/libs/types';
import { useAiTeacher } from '@/hooks/use-ai-teacher';

TEACHERS.forEach((teacher) => {
  useGLTF.preload(`/models/Teacher_${teacher}.glb`);
});

interface TeacherProps extends GroupProps {
  teacher: TeacherType;
}

const Teacher = ({
  teacher,
  ...props
}: TeacherProps) => {

  const { scene } = useGLTF(`/models/Teacher_${teacher}.glb`);

  const { currentMessage } = useAiTeacher();

  const [blink, setBlink] = useState(false);

  useEffect(() => {
    let blinkTimeout: ReturnType<typeof setTimeout>;
    const nextBlink = () => {
      blinkTimeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          nextBlink();
        }, 100);
      }, randInt(1000, 5000));
    }
    nextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  const lerpMorphTarget = (target: number | string, value: number, speed: number = 0.1) => {
    scene.traverse((child) => {
      if (child.isSkinnedMesh && child.morphTargetDictionary) {
        const index = child.morphTargetDictionary[target];

        if (
          index === undefined
          || child.morphTargetInfluences[index] === undefined
        ) {
          return;
        }

        child.morphTargetInfluences[index] =  MathUtils.lerp(
          child.morphTargetInfluences[index],
          value,
          speed,
        );
      }
    });
  }

  useFrame(() => {

    // Blinking animation
    lerpMorphTarget('eye_close', blink ? 1: 0, 0.5);

    // Talking animation
    for (let i = 0; i <= 21; i++) {
      lerpMorphTarget(i, 0, 0.1); // Reset morph targets
    }

    if (
      currentMessage
      && currentMessage.visemes
      && currentMessage.audioPlayer
    ) {
      for (let i = currentMessage.visemes.length - 1; i >= 0; i--) {
        const visime = currentMessage.visemes[i];
        if (currentMessage.audioPlayer.currentTime * 1000 >= visime[0]) {
          lerpMorphTarget(visime[1], 1, 0.2);
          break;
        }
      }
    }
  })

  return (
    <group {...props}>
      <primitive
        object={scene}
      />
    </group>
  )
}

export default Teacher