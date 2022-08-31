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
    tipper.addRule('AND', [['Service', 'Good']], ['Tip', 'Good']);
    expect(tipper.rules[0].prettyPrint()).toBe('IF Service IS Good THEN Tip IS Good');

    tipper.addRule(
      'AND',
      [
        ['Service', 'Good'],
        ['Service', 'Good'],
      ],
      ['Tip', 'Good']
    );
    expect(tipper.rules[1].prettyPrint()).toBe('IF Service IS Good AND Service IS Good THEN Tip IS Good');
  });

  it('should throw an error if the antecedent or consequent are malformed', () => {
    const tipper = new FuzzyInferenceSystem('Tipper').addInput(serviceVariable).addOutput(tipVariable);
    expect(() => tipper.addRule('AND', [], ['Tip', 'Good'])).toThrowError(
      'No antecedents (inputs) specified'
    );
    expect(() => tipper.addRule('AND', [['Food', 'Good', 'Service']], ['Tip', 'Good'])).toThrowError(
      'All antecedents should have two parts: a linguistic variable name, and a fuzzy set name'
    );
    expect(() => tipper.addRule('AND', [['Food', 'Good']], [])).toThrowError(
      'No consequent (output) specified'
    );
    expect(() => tipper.addRule('AND', [['Food', 'Good']], ['Tip'])).toThrowError(
      'A consequent should have two parts: a linguistic variable name, and a fuzzy set name'
    );
  });

  it('should throw an error if a rule does not contain valid variables/sets', () => {
    const tipper = new FuzzyInferenceSystem('Tipper').addInput(serviceVariable).addOutput(tipVariable);
    expect(() => tipper.addRule('AND', [['Service', 'Good']], ['Tipx', 'Good'])).toThrowError(
      'Consequent cannot be created (set or variable do not exist)'
    );
    expect(() => tipper.addRule('AND', [['Service', 'Great']], ['Tip', 'Good'])).toThrowError(
      'Antecedents could not be be created (at least one set or variable does not exist)'
    );
    expect(() => tipper.addRule('AND', [['Food', 'Good']], ['Tip', 'Good'])).toThrowError(
      'Antecedents could not be be created (at least one set or variable does not exist)'
    );
  });
});
