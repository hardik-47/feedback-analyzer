/**
 * Defines the structure of the JSON response we expect
 * from the /api/analyze-call route.
 * Based on the assignment PDF 
 */
export interface AnalysisScores {
  greeting: number;
  collectionUrgency: number;
  rebuttalCustomerHandling: number;
  callEtiquette: number;
  callDisclaimer: number;
  correctDisposition: number;
  callClosing: number;
  fatalIdentification: number;
  fatalTapeDiscloser: number;
  fatalToneLanguage: number;
}

export interface AnalysisResponse {
  scores: AnalysisScores;
  overallFeedback: string;
  observation: string;
}