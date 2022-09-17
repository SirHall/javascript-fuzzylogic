import { FuzzySet } from '../FuzzySet';

export interface EditLinguisticVariableArgs {
  name?: string;
  fuzzySets?: FuzzySet[];
}

export enum VariableType {
  'Input' = 'Input',
  'Output' = 'Output',
}
