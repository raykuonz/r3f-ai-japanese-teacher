import { create } from "zustand";

import { CLASSROOMS, SPEECHS, TEACHERS } from "@/libs/constants";
import { ClassroomType, SpeechType, TeacherType, VisemesType } from "@/libs/types";

interface Message {
  question: string;
  speech: SpeechType;
  id: number;
  answer: any; // TODO: chatgpt response type
  audioPlayer?: HTMLAudioElement;
  visemes?: VisemesType;
}

interface AiTeacherState {
  messages: Message[],
  currentMessage: Message | null,

  teacher: TeacherType,
  setTeacher: (teacher: TeacherType) => void;

  classroom: ClassroomType,
  setClassroom: (classroom: ClassroomType) => void;

  furigana: boolean,
  setFurigana: (furigana: boolean) => void;

  english: boolean,
  setEnglish: (english: boolean) => void;

  speech: SpeechType,
  setSpeech: (speech: SpeechType) => void;

  loading: boolean,
  askAi: (question: string) => void;

  playMessage: (message: Message) => void;
  stopMessage: (message: Message) => void;
}

export const useAiTeacher = create<AiTeacherState>((set, get) => ({
  messages: [],
  currentMessage: null,

  teacher: TEACHERS[0],
  setTeacher: (teacher) => set({ teacher }),

  classroom: CLASSROOMS[0],
  setClassroom: (classroom) => set({ classroom }),

  furigana: true,
  setFurigana: (furigana) => set({ furigana }),

  english: true,
  setEnglish: (english) => set({ english }),

  speech: SPEECHS[0],
  setSpeech: (speech) => set({ speech }),

  loading: false,
  askAi: async (question) => {

    if (!question) return;

    set({ loading: true });

    const speech = get().speech;

    const apiUrl = `/api/ai?question=${question}&speech=${speech}`;
    const response = await fetch(apiUrl);

    const data = await response.json();

    const message: Message = {
      question,
      speech,
      id: get().messages.length,
      answer: data,
    };

    set({ currentMessage: message })

    set((state) => ({
      messages: [...state.messages, message],
      loading: false,
    }));

    get().playMessage(message);
  },

  playMessage: async (message) => {
    set({ currentMessage: message });

    const teacher = get().teacher;

    const text = message.answer.japanese
      .map((word) => word.word)
      .join(' ');

    if (!message.audioPlayer) {
      const audioRes = await fetch(
        `/api/tts?teacher=${teacher}&text=${text}`
      );

      const audio = await audioRes.blob();

      const audioVisemes = await audioRes.headers.get('Visemes') || '';

      const visemes = JSON.parse(audioVisemes);

      const audioUrl = URL.createObjectURL(audio);
      const audioPlayer = new Audio(audioUrl);

      message.visemes = visemes;
      message.audioPlayer = audioPlayer;
      message.audioPlayer.onended = () => {
        set({ currentMessage: null });

        set({
          loading: false,
          messages: get().messages.map((msg) => {
            if (msg.id === message.id) {
              return message;
            }
            return msg;
          })
        })
      }
    }

    message.audioPlayer.currentTime = 0;
    message.audioPlayer.play();
  },

  stopMessage: (message) => {
    message.audioPlayer?.pause();
    set({ currentMessage: null });
  },

}));