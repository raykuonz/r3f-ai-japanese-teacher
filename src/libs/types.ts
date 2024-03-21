import {
  TEACHERS,
  CLASSROOMS,
  SPEECHS
} from "./constants";

export type TeacherType = typeof TEACHERS[number];
export type ClassroomType = typeof CLASSROOMS[number];
export type SpeechType = typeof SPEECHS[number];

export type VisemesType = [number, number][];