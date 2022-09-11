import { DefuzzicationType } from '../defuzzify';
import { LinguisticVariable } from '../index';
import { LinguisticRule, LinguisticRuleOperator } from '../LinguisticRule';
import { mamdaniInference } from './utils';

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

  removeVariable = (name: string, type: 'Input' | 'Output') => {
    if (type === 'Input') {
      this.inputs = this.inputs.filter((variable) => variable.name !== name);
    } else {
      this.outputs = this.outputs.filter((variable) => variable.name !== name);
    }
    return this;
  };

  removeInput = (name: string) => {
    return this.removeVariable(name, 'Input');
  };

  removeOutput = (name: string) => {
    return this.removeVariable(name, 'Output');
  };

  addInput = (newVariable: LinguisticVariable) => {
    if (this.inputs.find((variable) => variable.name === newVariable.name)) {
      throw new Error('An input with that name already exists');
    }
    return this.addVariable(newVariable, 'Input');
  };

  addOutput = (newVariable: LinguisticVariable) => {
    if (this.outputs.find((variable) => variable.name === newVariable.name)) {
      throw new Error('An output with that name already exists');
    }
    return this.addVariable(newVariable, 'Output');
  };

  addRule = (rule: string) => {
    const operator = rule.match('AND') ? 'AND' : 'OR';
    const parts = rule.split(/IF|IS|THEN|AND|OR| /).filter(Boolean);

    if (parts.length % 2 !== 0) {
      throw new Error('Rule string is malformed');
    }

    const antecedents: string[][] = [];
    const consequent: string[] = [];
    for (let i = 0; i < parts.length; i += 2) {
      if (i === parts.length - 2) {
        consequent.push(parts[i]);
        consequent.push(parts[i + 1]);
      } else {
        antecedents.push([parts[i], parts[i + 1]]);
      }
    }

    if (antecedents.length === 0) {
      throw new Error('No antecedents (inputs) specified');
    }

    if (consequent.length === 0) {
      throw new Error('No consequent (output) specified');
    }

    try {
      this.checkAntecedentsAndConsequentAreValid(antecedents, consequent);
    } catch ({ message }) {
      throw new Error(message as string);
    }

    const linguisticRule = new LinguisticRule(
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

    this.rules.push(linguisticRule);
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
      throw new Error(
        `Consequent cannot be created (variable ${consequent[0]} or set ${consequent[1]} do not exist)`
      );
    }
  };

  solve = (type: 'Mamdani', args: Record<string, number>, defuzzicationMethod: DefuzzicationType): number => {
    const allInputsHaveArg = this.inputs.every((input) => args[input.name] !== undefined);
    if (!allInputsHaveArg) {
      throw new Error('Not all input variables have an argument provided');
    }

    if (this.inputs.length === 0) {
      throw new Error('Cannot solve: No inputs defined');
    }

    if (this.outputs.length === 0) {
      throw new Error('Cannot solve: No outputs defined');
    }

    if (this.rules.length === 0) {
      throw new Error('Cannot solve: No rules defined');
    }

    if (type === 'Mamdani') {
      return mamdaniInference(this.inputs, this.outputs, this.rules, args, defuzzicationMethod);
    }
    throw new Error('Unknown defuzzification method specified');
  };
}
