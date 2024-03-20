import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

const formalExample = {
  japanese: [
    { word: "日本", reading: "にほん" },
    { word: "に" },
    { word: "住んで", reading: "すんで" },
    { word: "います" },
    { word: "か" },
    { word: "?" },
  ],
  grammarBreakdown: [
    {
      english: "Do you live in Japan?",
      japanese: [
        { word: "日本", reading: "にほん" },
        { word: "に" },
        { word: "住んで", reading: "すんで" },
        { word: "います" },
        { word: "か" },
        { word: "?" },
      ],
      chunks: [
        {
          japanese: [{ word: "日本", reading: "にほん" }],
          meaning: "Japan",
          grammar: "Noun",
        },
        {
          japanese: [{ word: "に" }],
          meaning: "in",
          grammar: "Particle",
        },
        {
          japanese: [{ word: "住んで", reading: "すんで" }, { word: "います" }],
          meaning: "live",
          grammar: "Verb + て form + います",
        },
        {
          japanese: [{ word: "か" }],
          meaning: "question",
          grammar: "Particle",
        },
        {
          japanese: [{ word: "?" }],
          meaning: "question",
          grammar: "Punctuation",
        },
      ],
    },
  ],
};

const casualExample = {
  japanese: [
    { word: "日本", reading: "にほん" },
    { word: "に" },
    { word: "住んで", reading: "すんで" },
    { word: "いる" },
    { word: "の" },
    { word: "?" },
  ],
  grammarBreakdown: [
    {
      english: "Do you live in Japan?",
      japanese: [
        { word: "日本", reading: "にほん" },
        { word: "に" },
        { word: "住んで", reading: "すんで" },
        { word: "いる" },
        { word: "の" },
        { word: "?" },
      ],
      chunks: [
        {
          japanese: [{ word: "日本", reading: "にほん" }],
          meaning: "Japan",
          grammar: "Noun",
        },
        {
          japanese: [{ word: "に" }],
          meaning: "in",
          grammar: "Particle",
        },
        {
          japanese: [{ word: "住んで", reading: "すんで" }, { word: "いる" }],
          meaning: "live",
          grammar: "Verb + て form + いる",
        },
        {
          japanese: [{ word: "の" }],
          meaning: "question",
          grammar: "Particle",
        },
        {
          japanese: [{ word: "?" }],
          meaning: "question",
          grammar: "Punctuation",
        },
      ],
    },
  ],
};

export const GET = async (req: NextRequest) => {
  const speech = req.nextUrl.searchParams.get('speech') || 'formal';
  const speechExample = speech === 'formal' ? formalExample : casualExample;

  const chatCompletion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    response_format: {
      type: 'json_object',
    },
    messages: [
      {
        role: 'system',
        content: `You are a Japanese language teacher.
Your student asks how to say something from english to japanese.
You should response with:
- english: the english version ex: "Do you live in Japan?"
- japanese: the japanese translation in split into words ex: ${JSON.stringify(
  speechExample.japanese
)}
- grammarBreakdown: an explanation of the grammer structure per sentence ex: ${JSON.stringify(
  speechExample.grammarBreakdown
)}
`
      },
      {
        role: 'system',
        content: `you always respond with a JSON object with the following format:
{
  "english": "",
  "japanese": [{
    "word": "",
    "reading": ""
  }],
  "grammarBreakdown": [{
    "english": "",
    "japanese": [{
      "word": "",
      "reading": ""
    }],
    "chunks": [{
      "japanese": [{
        "word": "",
        "reading": ""
      }],
      "meaning": "",
      "grammar": ""
    }]
  }]
}`,
      },
      {
        role: 'user',
        content: `How to say ${
          req.nextUrl.searchParams.get('question')
          || "Have you ever been to Japan?"
        } in japanese in ${speech} speech?`,
      }
    ]
  });

  return Response.json(
    JSON.parse(chatCompletion.choices[0].message.content || '')
  );
}