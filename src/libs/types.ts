import {
  TEACHERS,
  CLASSROOMS,
  SPEECHS
} from "./constants";

export type TeacherType = typeof TEACHERS[number];
export type ClassroomType = typeof CLASSROOMS[number];
export type SpeechType = typeof SPEECHS[number];

export type VisemesType = [number, number][];

export interface ChatGPTAnswerJapaneseInterface {
  word: string;
  reading: string;
}

export interface ChatGPTAnswerInterface {
  english: string;
  japanese: ChatGPTAnswerJapaneseInterface[];
  grammarBreakdown: [
    {
      english: string;
      japanese: ChatGPTAnswerJapaneseInterface[];
      chunks: [
        {
          japanese: ChatGPTAnswerJapaneseInterface[];
          meaning: string;
          grammar: string;
        }
      ];
    }
  ],
}