"use client";

import Image from "next/image";

import {
  CLASSROOMS,
  SPEECHS,
  TEACHERS
} from "@/libs/constants";
import { cn } from "@/libs/utils";
import { useAiTeacher } from "@/hooks/use-ai-teacher";

const BoardSettings = () => {

  const {
    furigana,
    setFurigana,
    english,
    setEnglish,
    teacher: teacherState,
    setTeacher,
    classroom: classroomState,
    setClassroom,
    speech: speechState,
    setSpeech,
  } = useAiTeacher();

  return (
    <>
      <div
        className="absolute right-0 bottom-full flex flex-row gap-10 mb-20"
      >
        {TEACHERS.map((teacher) => (
          <div
            key={teacher}
            className={cn(
              "p-3 transition-colors duration-500 bg-white/40",
              (teacher === teacherState) && "bg-white/80"
            )}
          >
            <div
              onClick={() => setTeacher(teacher)}
              className="cursor-pointer"
            >
              <Image
                src={`/images/${teacher}.jpg`}
                width={40}
                height={40}
                alt={teacher}
                className="object-cover"
              />
            </div>
            <h2
              className="text-3xl font-bold mt-3 text-center"
            >
              {teacher}
            </h2>
          </div>
        ))}
      </div>

      <div
        className="absolute left-0 bottom-full flex flex-row gap-2 mb-20"
      >
        {CLASSROOMS.map((classroom) => (
          <button
            key={classroom}
            onClick={() => setClassroom(classroom)}
            className={cn(
              "text-white/45 bg-slate-700/20 py-4 px-10 text-4xl rounded-full transition-colors duration-500 background-blur-md",
              (classroom === classroomState) && "text-white bg-slate-900/40",
            )}
          >
            {classroom} classroom
          </button>
        ))}
      </div>

      <div
        className="absolute left-0 top-full flex flex-row gap-2 mt-20"
      >
        {SPEECHS.map((speech) => (
          <button
            key={speech}
            onClick={() => setSpeech(speech)}
            className={cn(
              "text-white/45 bg-slate-700/20 py-4 px-10 text-4xl rounded-full transition-colors duration-500 background-blur-md",
              (speech === speechState) && "text-white bg-slate-900/40",
            )}
          >
            {speech}
          </button>
        ))}
      </div>

      <div
        className="absolute right-0 top-full flex flex-row gap-2 mt-20"
      >
        <button
          onClick={() => setFurigana(!furigana)}
          className={cn(
            "text-white/45 bg-slate-700/20 py-4 px-10 text-4xl rounded-full transition-colors duration-500 background-blur-md",
            furigana && "text-white bg-slate-900/40",
          )}
        >
          Furigana
        </button>
        <button
          onClick={() => setEnglish(!english)}
          className={cn(
            "text-white/45 bg-slate-700/20 py-4 px-10 text-4xl rounded-full transition-colors duration-500 background-blur-md",
            english && "text-white bg-slate-900/40",
          )}
        >
          English
        </button>
      </div>
    </>
  )
}

export default BoardSettings