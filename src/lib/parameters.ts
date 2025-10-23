/**
 * we here defines the metadata for each call evaluation parameter
 */

export interface Parameter {
  key: string;
  name: string;
  weight: number;
  desc: string;
  inputType: 'PASS_FAIL' | 'SCORE';
}


export const CALL_PARAMETERS: Parameter[] = [
  {
    key: 'greeting',
    name: 'Greeting',
    weight: 5,
    desc: 'Call opening within 5 seconds',
    inputType: 'PASS_FAIL',
  },
  {
    key: 'collectionUrgency',
    name: 'Collection Urgency',
    weight: 15,
    desc: 'Create urgency, cross-questioning',
    inputType: 'SCORE',
  },
  {
    key: 'rebuttalCustomerHandling',
    name: 'Rebuttal Handling',
    weight: 15,
    desc: 'Address penalties, objections',
    inputType: 'SCORE',
  },
  {
    key: 'callEtiquette',
    name: 'Call Etiquette',
    weight: 15,
    desc: 'Tone, empathy, clear speech',
    inputType: 'SCORE',
  },
  {
    key: 'callDisclaimer',
    name: 'Call Disclaimer',
    weight: 5,
    desc: 'Take permission before ending',
    inputType: 'PASS_FAIL',
  },
  {
    key: 'correctDisposition',
    name: 'Correct Disposition',
    weight: 10,
    desc: 'Use correct category with remark',
    inputType: 'PASS_FAIL',
  },
  {
    key: 'callClosing',
    name: 'Call Closing',
    weight: 5,
    desc: 'Thank the customer properly',
    inputType: 'PASS_FAIL',
  },
  {
    key: 'fatalIdentification',
    name: 'Identification',
    weight: 5,
    desc: 'Missing agent/customer info',
    inputType: 'PASS_FAIL',
  },
  {
    key: 'fatalTapeDiscloser',
    name: 'Tape Disclosure',
    weight: 10,
    desc: 'Inform customer about recording',
    inputType: 'PASS_FAIL',
  },
  {
    key: 'fatalToneLanguage',
    name: 'Tone & Language',
    weight: 15,
    desc: 'No abusive or threatening speech',
    inputType: 'PASS_FAIL',
  },
];