import { tipper } from '../tipperExample';
import { combineSetsWithMaximum, mamdaniInference } from './utils';
import { DefuzzicationType, FuzzySet, MembershipFunctionType } from '..';

describe('combineSetsWithMaximum', () => {
  it('should combine a single set', () => {
    expect(combineSetsWithMaximum([[{ membership: 0, value: 1 }]])).toStrictEqual([
      { membership: 0, value: 1 },
    ]);
  });

  it('should combine two sets', () => {
    expect(
      combineSetsWithMaximum([[{ membership: 0.5, value: 1 }], [{ membership: 0, value: 1 }]])
    ).toStrictEqual([{ membership: 0.5, value: 1 }]);
  });

  it('should combine multiple sets', () => {
    expect(
      combineSetsWithMaximum([
        [
          { membership: 0.5, value: 1 },
          { membership: 0.5, value: 2 },
          { membership: 0.5, value: 3 },
        ],
        [
          { membership: 0.75, value: 1 },
          { membership: 0.75, value: 2 },
          { membership: 0.25, value: 3 },
        ],
        [
          { membership: 1, value: 1 },
          { membership: 0, value: 2 },
          { membership: 0, value: 3 },
        ],
        [
          { membership: 0, value: 1 },
          { membership: 0, value: 2 },
          { membership: 1, value: 3 },
        ],
      ])
    ).toStrictEqual([
      { membership: 1, value: 1 },
      { membership: 0.75, value: 2 },
      { membership: 1, value: 3 },
    ]);
  });
});

describe('mamdaniInference', () => {
  it('should throw an error if the arguments do not match the variables', () => {
    expect(() =>
      mamdaniInference(
        tipper.inputs,
        tipper.outputs,
        tipper.rules,
        {
          service: 5,
          food: 5,
        },
        DefuzzicationType.SmallestOfMaxima
      )
    ).toThrowError('Argument service does not relate to any variable in the system');
  });

  it('should return a single crisp value for a given fuzzy inference system', () => {
    expect(
      mamdaniInference(
        tipper.inputs,
        tipper.outputs,
        tipper.rules,
        {
          Service: 8,
          Food: 3,
        },
        DefuzzicationType.SmallestOfMaxima
      )
    ).toBe(22.5);

    expect(
      mamdaniInference(
        tipper.inputs,
        tipper.outputs,
        tipper.rules,
        {
          Service: 8,
          Food: 3,
        },
        DefuzzicationType.LargestOfMaxima
      )
    ).toBe(27.5);

    expect(
      mamdaniInference(
        tipper.inputs,
        tipper.outputs,
        tipper.rules,
        {
          Service: 8,
          Food: 3,
        },
        DefuzzicationType.MeanOfMaxima
      )
    ).toBe(25);

    expect(
      mamdaniInference(
        tipper.inputs,
        tipper.outputs,
        tipper.rules,
        {
          Service: 8,
          Food: 3,
        },
        DefuzzicationType.Centroid
      )
    ).toBe(22.228483184636442);
  });
});
