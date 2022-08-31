import { FuzzySet } from '../FuzzySet';
import { LinguisticVariable } from '../LinguisticVariable';
import { MembershipFunctionType } from '../membershipFunction';
import { FuzzyInferenceSystem } from './FuzzyInferenceSystem';

const poorService = new FuzzySet('Poor').generateMembershipValues({
  type: MembershipFunctionType.Gaussian,
  parameters: {
    center: 0,
    standardDeviation: 1.5,
    minValue: 0,
    maxValue: 10,
    step: 0.5,
  },
});

const goodService = new FuzzySet('Good').generateMembershipValues({
  type: MembershipFunctionType.Gaussian,
  parameters: {
    center: 5,
    standardDeviation: 1.5,
    minValue: 0,
    maxValue: 10,
    step: 0.5,
  },
});

const serviceVariable = new LinguisticVariable('Service').addSet(poorService).addSet(goodService);

const goodFood = new FuzzySet('Good').generateMembershipValues({
  type: MembershipFunctionType.Gaussian,
  parameters: {
    center: 5,
    standardDeviation: 1.5,
    minValue: 0,
    maxValue: 10,
    step: 0.5,
  },
});

const foodVariable = new LinguisticVariable('Food').addSet(goodFood);

const goodTip = new FuzzySet('Good').generateMembershipValues({
  type: MembershipFunctionType.Gaussian,
  parameters: {
    center: 5,
    standardDeviation: 1.5,
    minValue: 0,
    maxValue: 10,
    step: 0.5,
  },
});

const tipVariable = new LinguisticVariable('Tip').addSet(goodTip);

describe('FuzzyInferenceSystem', () => {
  it('should able to be created with no sets', () => {
    const tipper = new FuzzyInferenceSystem('Tipper');
    expect(tipper.inputs).toHaveLength(0);
    expect(tipper.outputs).toHaveLength(0);
    expect(tipper.name).toBe('Tipper');
  });

  it('should be able to be created with some fuzzy sets', () => {
    const tipper = new FuzzyInferenceSystem('Tipper', [serviceVariable], [serviceVariable]);
    expect(tipper.inputs).toHaveLength(1);
    expect(tipper.outputs).toHaveLength(1);
  });

  it('should be able to be add sets', () => {
    const tipper = new FuzzyInferenceSystem('Tipper');
    expect(tipper.inputs).toHaveLength(0);
    expect(tipper.outputs).toHaveLength(0);

    tipper.addInput(serviceVariable);
    tipper.addOutput(serviceVariable);

    expect(tipper.inputs).toHaveLength(1);
    expect(tipper.outputs).toHaveLength(1);
  });

  it('should be able to chain add variables', () => {
    const tipper = new FuzzyInferenceSystem('Tipper').addInput(serviceVariable).addOutput(serviceVariable);

    expect(tipper.inputs).toHaveLength(1);
    expect(tipper.outputs).toHaveLength(1);
  });

  it('should be able to add a rule', () => {
    const tipper = new FuzzyInferenceSystem('Tipper').addInput(serviceVariable).addOutput(tipVariable);
    tipper.addRule('IF Service IS Good THEN Tip IS Good');
    expect(tipper.rules[0].prettyPrint()).toBe('IF Service IS Good THEN Tip IS Good');

    tipper.addRule('IF Service IS Good AND Service IS Good THEN Tip IS Good');
    expect(tipper.rules[1].prettyPrint()).toBe('IF Service IS Good AND Service IS Good THEN Tip IS Good');
  });

  it('should throw an error if the antecedent or consequent are malformed', () => {
    const tipper = new FuzzyInferenceSystem('Tipper').addInput(serviceVariable).addOutput(tipVariable);
    expect(() => tipper.addRule('IF THEN Tip IS Good')).toThrowError('No antecedents (inputs) specified');
    expect(() => tipper.addRule('IF Food IS Good AND Service IS THEN Tip IS Good')).toThrowError(
      'Rule string is malformed'
    );
    expect(() => tipper.addRule('IF Food IS Good THEN Tip IS')).toThrowError('Rule string is malformed');
  });

  it('should throw an error if a rule does not contain valid variables/sets', () => {
    const tipper = new FuzzyInferenceSystem('Tipper').addInput(serviceVariable).addOutput(tipVariable);
    expect(() => tipper.addRule('IF Service IS Good THEN Tipx IS Good')).toThrowError(
      'Consequent cannot be created (set or variable do not exist)'
    );
    expect(() => tipper.addRule('IF Service IS Great THEN Tip IS Good')).toThrowError(
      'Antecedents could not be be created (at least one set or variable does not exist)'
    );
    expect(() => tipper.addRule('IF Food IS Good THEN Tip IS Good')).toThrowError(
      'Antecedents could not be be created (at least one set or variable does not exist)'
    );
  });

  it('should error if not all input variables are given an argument', () => {
    const tipper = new FuzzyInferenceSystem('Tipper')
      .addInput(serviceVariable)
      .addInput(foodVariable)
      .addOutput(tipVariable);

    expect(() => tipper.solve('Mamdani', { Service: 5 })).toThrowError(
      'Not all input variables have an argument provided'
    );
  });

  it('should error if inputs, outputs or rules are missing', () => {
    const tipper = new FuzzyInferenceSystem('Tipper');
    expect(() => tipper.solve('Mamdani', { Service: 5, Food: 5 })).toThrowError(
      'Cannot solve: No inputs defined'
    );

    tipper.addInput(serviceVariable);
    expect(() => tipper.solve('Mamdani', { Service: 5, Food: 5 })).toThrowError(
      'Cannot solve: No outputs defined'
    );

    tipper.addOutput(tipVariable);
    expect(() => tipper.solve('Mamdani', { Service: 5, Food: 5 })).toThrowError(
      'Cannot solve: No rules defined'
    );

    tipper.addRule('Service IS Good THEN Tip IS Good');
    expect(() => tipper.solve('Mamdani', { Service: 5, Food: 5 })).not.toThrowError();
  });

  it('should be solvable', () => {
    const tipper = new FuzzyInferenceSystem('Tipper')
      .addInput(serviceVariable)
      .addInput(foodVariable)
      .addOutput(tipVariable)
      .addRule('Service IS Good THEN Tip IS Good');

    expect(tipper.solve('Mamdani', { Service: 5, Food: 5 })).toBe(0);
  });
});
