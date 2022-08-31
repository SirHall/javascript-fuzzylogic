import { LinguisticVariable } from '../index';
import { Antecedent, Consequent, LinguisticRule, LinguisticRuleOperator } from '../LinguisticRule';

export class FuzzyInferenceSystem {
  name: string;
  inputs: LinguisticVariable[];
  outputs: LinguisticVariable[];
  rules: LinguisticRule[];

  constructor(name: string, inputs: LinguisticVariable[] = [], outputs: LinguisticVariable[] = []) {
    this.name = name;
    this.inputs = inputs;
    this.outputs = outputs;
    this.rules = [];
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

  addRule = (operator: LinguisticRuleOperator, antecedents: string[][], consequent: string[]) => {
    if (antecedents.length === 0) {
      throw new Error('No antecedents (inputs) specified');
    }

    if (antecedents.flat().length % 2 !== 0) {
      throw new Error(
        'All antecedents should have two parts: a linguistic variable name, and a fuzzy set name'
      );
    }

    if (consequent.length === 0) {
      throw new Error('No consequent (output) specified');
    }

    if (consequent.length !== 2) {
      throw new Error('A consequent should have two parts: a linguistic variable name, and a fuzzy set name');
    }

    try {
      this.checkAntecedentsAndConsequentAreValid(antecedents, consequent);
    } catch ({ message }) {
      throw new Error(message as string);
    }

    const rule = new LinguisticRule(
      operator,
      antecedents.map((antecedentParts) => ({
        linguisticVariable: antecedentParts[0],
        fuzzySet: antecedentParts[1],
      })),
      {
        linguisticVariable: consequent[0],
        fuzzySet: consequent[1],
      }
    );

    this.rules.push(rule);
    return this;
  };

  checkAntecedentsAndConsequentAreValid = (antecedents: string[][], consequent: string[]) => {
    const allAntecedentsExist = antecedents.every((antecedent) => {
      return (
        this.inputs.find((input) => antecedent[0] === input.name)?.indexedFuzzySets[antecedent[1]] !==
        undefined
      );
    });
    if (!allAntecedentsExist) {
      throw new Error('Antecedents could not be be created (at least one set or variable does not exist)');
    }

    const consequentExists =
      this.outputs.find((output) => consequent[0] === output.name)?.indexedFuzzySets[consequent[1]] !==
      undefined;
    if (!consequentExists) {
      throw new Error('Consequent cannot be created (set or variable do not exist)');
    }
  };
}
