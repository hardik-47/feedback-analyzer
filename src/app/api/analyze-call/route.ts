import { NextResponse } from 'next/server';
import { AnalysisResponse } from '@/lib/types';

/**
 * MOCK API Route for /api/analyze-call [cite: 17]
 *
 * This route simulates the AI processing by:
 * 1. Waiting for 2 seconds.
 * 2. Returning the sample JSON data from the assignment PDF .
 */
export async function POST(request: Request) {
  // We don't need to read the `request.formData()` yet,
  // since this is just a mock.

  // Simulate a 2-second processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // The sample response from the PDF [cite: 24-27]
  const mockResponse: AnalysisResponse = {
    scores: {
      greeting: 5,
      collectionUrgency: 12,
      // NOTE: You should fill in the rest of the scores
      // from the PDF parameters (page 3) [cite: 56-63]
      rebuttalCustomerHandling: 10,
      callEtiquette: 10,
      callDisclaimer: 0,
      correctDisposition: 10,
      callClosing: 5,
      fatalIdentification: 5,
      fatalTapeDiscloser: 0,
      fatalToneLanguage: 15,
    },
    overallFeedback:
      'The agent was confident and persuasive, though failed to provide disclaimer.',
    observation:
      'Customer raised objections about penalty. Agent managed well but missed tape disclosure.',
  };

  return NextResponse.json(mockResponse);
}