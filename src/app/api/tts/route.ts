import { NextRequest } from "next/server";
import { PassThrough } from "stream";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

export const GET = async(req: NextRequest) => {

  const speechConfig = sdk.SpeechConfig.fromSubscription(
    process.env.AZURE_SPEECH_KEY!,
    process.env.AZURE_SPEECH_REGION!,
  );

  const teacher = req.nextUrl.searchParams.get('teacher') || 'Nanami';

  speechConfig.speechSynthesisVoiceName = `ja-JP-${teacher}Neural`;

  const speechSynthesizer = new sdk.SpeechSynthesizer(speechConfig);

  const visemes: [number, number][] = [];
  speechSynthesizer.visemeReceived = (sender, event) => {
    visemes.push([event.audioOffset / 10000, event.visemeId]);
  }

  const audioStream = await new Promise((resolve, reject) => {
    speechSynthesizer.speakTextAsync(
      req.nextUrl.searchParams.get('text')
      || `I'm excited to try text to speech`,
      (result) => {
        const { audioData } = result;
        speechSynthesizer.close();

        // Convert arraybuffer to stream
        const bufferStream = new PassThrough();
        bufferStream.end(Buffer.from(audioData));
        resolve(bufferStream);
      },
      (error) => {
        console.error('speechSynthesizer.speakTextAsync error', error);

        speechSynthesizer.close();
        reject(error);
      }
    );
  });

  const response = new Response(audioStream, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': 'inline; filename=tts.mp3',
      Visemes: JSON.stringify(visemes),
    },
  });

  return response;
}
