"use client";

import { useEffect, useRef, useState } from 'react'
import { MathUtils } from 'three';
import { randInt } from 'three/src/math/MathUtils.js';
import { Html, useAnimations, useGLTF } from '@react-three/drei'
import { GroupProps, useFrame } from '@react-three/fiber';

import { TEACHERS } from '@/libs/constants';
import { TeacherType } from '@/libs/types';
import { useAiTeacher } from '@/hooks/use-ai-teacher';

const ANIMATION_FADE_TIME = 0.5;

TEACHERS.forEach((teacher) => {
  useGLTF.preload(`/models/Teacher_${teacher}.glb`);
});

interface TeacherProps extends GroupProps {
  teacher: TeacherType;
}

type AnimationState = 'Idle' | 'Thinking' | 'Talking' | 'Talking2';

const Teacher = ({
  teacher,
  ...props
}: TeacherProps) => {

  const group = useRef(null);

  const { scene } = useGLTF(`/models/Teacher_${teacher}.glb`);
  const { animations } = useGLTF(`/models/animations_${teacher}.glb`);
  const { actions, mixer } = useAnimations(animations, group);
  const [ animation, setAnimation ] = useState<AnimationState>('Idle');
  const [ thinkingText, setThinkingText ] = useState('.');

  const {
    currentMessage,
    loading,
  } = useAiTeacher();

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

  useEffect(() => {
    if (loading) {
      setAnimation('Thinking');
    } else if (currentMessage) {
      setAnimation(randInt(0, 1) ? 'Talking' : 'Talking2');
    } else {
      setAnimation('Idle');
    }
  }, [currentMessage, loading]);

  useEffect(() => {
    actions[animation]
      ?.reset()
      .fadeIn(mixer.time > 0 ? ANIMATION_FADE_TIME : 0)
      .play();
    return () => {
      actions[animation]?.fadeOut(ANIMATION_FADE_TIME);
    }
  }, [animation, actions, mixer]);

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

    if (
      actions[animation].time >
      actions[animation].getClip().duration - ANIMATION_FADE_TIME
    ) {
      setAnimation((animation) =>
        animation === 'Talking' ? 'Talking2' : 'Talking'
      );
    }
  })

  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setThinkingText((text) => {
        if (text.length >= 3) {
          return '.';
        }
        return text + '.';
      },)
    }, 500);

    return () => clearInterval(interval);
  }, [loading])

  return (
    <group {...props} ref={group}>
      {loading && (
        <Html position-y={teacher === "Nanami" ? 1.6 : 1.8}>
          <div className="flex justify-center items-center -translate-x-1/2">
            <span className="relative flex h-8 w-8 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex items-center justify-center duration-75 rounded-full h-8 w-8 bg-white/80">
                {thinkingText}
              </span>
            </span>
          </div>
        </Html>
      )}
      <primitive
        object={scene}
      />
    </group>
  )
}

export default Teacher