/**
 *we here define the structure of the JSON response 
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