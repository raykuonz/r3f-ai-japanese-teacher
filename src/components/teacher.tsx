"use client";

import React from 'react'
import { useGLTF } from '@react-three/drei'
import { GroupProps } from '@react-three/fiber';

export const teachers = [
  'Nanami',
  'Naoki',
];

teachers.forEach((teacher) => {
  useGLTF.preload(`/models/Teacher_${teacher}.glb`);
});

interface TeacherProps extends GroupProps {
  teacher: string;
}

const Teacher = ({
  teacher,
  ...props
}: TeacherProps) => {

  const { scene } = useGLTF(`/models/Teacher_${teacher}.glb`);

  return (
    <group {...props}>
      <primitive
        object={scene}
      />
    </group>
  )
}

export default Teacher