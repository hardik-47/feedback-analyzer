import { NextResponse } from 'next/server';
import { createClient, DeepgramClient } from '@deepgram/sdk';
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';
import { AnalysisResponse } from '@/lib/types';
import { CALL_PARAMETERS, Parameter } from '@/lib/parameters';

//  Deepgram Client
const deepgram: DeepgramClient = createClient(
  process.env.DEEPGRAM_API_KEY || ''
);

//  Google Gemini Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const geminiModel = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash', // Use the fast and capable Flash model
});


export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('audio') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No audio file found' },
        { status: 400 }
      );
    }

    //Transcribing the audio file using Deepgram 

    
    const audioBuffer = Buffer.from(await file.arrayBuffer());

    const { result, error: deepgramError } =
      await deepgram.listen.prerecorded.transcribeFile(audioBuffer, {
        model: 'nova-2',
        smart_format: true,
      });

    if (deepgramError) {
      throw new Error(`Deepgram Error: ${deepgramError.message}`);
    }

    const transcriptText = result.results.channels[0].alternatives[0].transcript;

    if (!transcriptText) {
      throw new Error('Transcription failed, no text returned.');
    }

    // Analyzing the transcript using Google Gemini
    const analysisPrompt = createAnalysisPrompt(transcriptText, CALL_PARAMETERS);

   
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ];

    const resultFromGemini = await geminiModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: analysisPrompt }] }],
      safetySettings,
      generationConfig: {
        responseMimeType: 'application/json', 
      },
    });

    const analysisJson =
      resultFromGemini.response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!analysisJson) {
      throw new Error('Google Gemini AI failed to return JSON content.');
    }

    // Parsing the JSON string from the AI into our TypeScript type
    const parsedAnalysis = JSON.parse(analysisJson) as AnalysisResponse;

    return NextResponse.json(parsedAnalysis);
  } catch (error: any) {
    console.error('Error in AI pipeline:', error);
    return NextResponse.json(
      { error: 'Failed to analyze call', details: error.message },
      { status: 500 }
    );
  }
}


function createAnalysisPrompt(
  transcript: string,
  parameters: Parameter[]
): string {
  return `
    You are an AI call center quality assurance manager.
    Your task is to analyze the following call transcript and provide structured feedback in JSON format.

    Transcript:
    ---
    ${transcript}
    ---

    Please evaluate the transcript based on these parameters:
    ${JSON.stringify(parameters, null, 2)}

    RULES FOR SCORING:
    1. For all parameters with "inputType": "PASS_FAIL", the score MUST be either 0 (fail) or the exact weight (pass).
    2. For all parameters with "inputType": "SCORE", the score can be any integer between 0 and the weight.

    YOUR RESPONSE MUST BE a single, valid JSON object in this exact format:
    {
      "scores": {
        "greeting": <number>,
        "collectionUrgency": <number>,
        "rebuttalCustomerHandling": <number>,
        "callEtiquette": <number>,
        "callDisclaimer": <number>,
        "correctDisposition": <number>,
        "callClosing": <number>,
        "fatalIdentification": <number>,
        "fatalTapeDiscloser": <number>,
        "fatalToneLanguage": <number>
      },
      "overallFeedback": "<Provide a brief, 2-sentence overall feedback for the agent>",
      "observation": "<Provide a brief, 2-sentence observation of key events or customer objections>"
    }
  `;
}