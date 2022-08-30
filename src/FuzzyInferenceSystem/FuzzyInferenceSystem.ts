import { LinguisticVariable } from '../index';

export class FuzzyInferenceSystem {
  name: string;
  inputs: LinguisticVariable[];
  outputs: LinguisticVariable[];

  constructor(name: string, inputs: LinguisticVariable[] = [], outputs: LinguisticVariable[] = []) {
    this.name = name;
    this.inputs = inputs;
    this.outputs = outputs;
  }

  addVariable = (variable: LinguisticVariable, type: 'Input' | 'Output') => {
    if (type === 'Input') {
      this.inputs.push(variable);
    } else {
      this.outputs.push(variable);
    }
    return this;
  };

  addInput = (variable: LinguisticVariable) => this.addVariable(variable, 'Input');

  addOutput = (variable: LinguisticVariable) => this.addVariable(variable, 'Output');
}
