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
});
