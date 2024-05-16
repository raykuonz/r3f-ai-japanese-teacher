"use client";

import { useEffect, useRef } from "react";

import { useAiTeacher } from "@/hooks/use-ai-teacher";
import { cn } from "@/libs/utils";
import { ChatGPTAnswerJapaneseInterface } from "@/libs/types";

const MessagesList = () => {

  const {
    messages,
    currentMessage,
    playMessage,
    stopMessage,
    english,
    furigana,
    classroom,
  } = useAiTeacher();

  const container = useRef<HTMLDivElement|null>(null);

  useEffect(() => {
    container?.current?.scrollTo({
      top: container.current?.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages.length]);

  const renderEnglish = (englishText: string) => (
    <>
      {english && (
        <p className="text-4xl inline-block px-2 rounded-sm font-bold bg-clip-text text-transparent bg-gradient-to-br from-blue-300/90 to-white/90">
          {englishText}
        </p>
      )}
    </>
  );

  const renderJapanese = (japanese: ChatGPTAnswerJapaneseInterface[]) => (
    <p className="text-white font-bold text-4xl mt-2 font-jp flex flex-wrap gap-1">
      {japanese.map((word, i) => (
        <span key={i} className="flex flex-col justify-end items-center">
          {furigana && word.reading && (
            <span className="text-2xl text-white/65">{word.reading}</span>
          )}
          {word.word}
        </span>
      ))}
    </p>
  );

  return (
    <div
      ref={container}
      className={cn(
        "p-8 overflow-y-auto flex flex-col space-y-8 bg-transparent opacity-80 w-[1288px] h-[676px]",
        (classroom === "alternative") && "w-[2528px] h-[856px]",
      )}
    >
      {messages.length === 0 && (
        <div
          className="h-full w-full grid place-content-center text-center"
        >
          <h2
            className="text-8xl font-bold text-white/90 italic"
          >
            Mama Sensei
            <br />
            Japanese Language School
          </h2>
          <p
            className="text-8xl font-bold font-jp text-red-600/90 italic"
          >
            ママ先生日本語学校
          </p>
        </div>
      )}
      {messages.map((message) => (
        <div
          key={message.id}
        >
          <div className="flex">
            <div className="flex-grow">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "text-white/90 text-2xl font-bold uppercase px-3 py-1 rounded-full bg-teal-600",
                    (message.speech === 'formal') && "bg-indigo-600",
                  )}
                >
                  {message.speech}
                </span>
                {renderEnglish(message.answer.english)}
              </div>
              {renderJapanese(message.answer.japanese)}
            </div>
            {currentMessage?.id === message.id ? (
              <button
                className="text-white/65"
                onClick={() => stopMessage(message)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-16 h-16"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 0 1 9 14.437V9.564Z"
                  />
                </svg>
              </button>
            ) : (
              <button
                className="text-white/65"
                onClick={() => playMessage(message)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-16 h-16"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                  />
                </svg>
              </button>
            )}
          </div>
          <div className="p-5 mt-5  bg-gradient-to-br from-pink-200/20 to-pink-500/20 rounded-xl">
            <span className="pr-4 italic bg-clip-text text-transparent bg-gradient-to-b from-white/90 to-white/70 text-3xl font-bold uppercase inline-block">
              Grammar Breakdown
            </span>
            {message.answer.grammarBreakdown?.map((grammar, index) => (
              <div
                key={index}
                className="mt-3"
              >

                {message.answer.grammarBreakdown.length > 1 && (
                  <>
                    {renderEnglish(grammar.english)}
                    {renderJapanese(grammar.japanese)}
                  </>
                )}

                <div className="mt-3 flex flex-wrap gap-3 items-end">
                  {grammar.chunks?.map((chunk, i) => (
                    <div key={i} className="p-2 bg-black/30 rounded-md">
                      <p className="text-white/90 text-4xl font-jp">
                        {renderJapanese(chunk.japanese)}
                      </p>
                      <p className="text-pink-300/90 text-2xl">
                        {chunk.meaning}
                      </p>
                      <p className="text-blue-400/90 text-2xl">
                        {chunk.grammar}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MessagesList