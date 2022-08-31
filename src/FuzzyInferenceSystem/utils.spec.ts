import { employmentExample } from '../tipperExample';
import { combineSetsWithMaximum, mamdaniInference } from './utils';
import { DefuzzicationType } from '..';

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
  it('should return a single crisp value for a given fuzzy inference system', () => {
    expect(
      mamdaniInference(
        employmentExample.inputs,
        employmentExample.outputs,
        employmentExample.rules,
        {
          height: 180,
          age: 40,
        },
        DefuzzicationType.SmallestOfMaxima
      )
    ).toBe(4);

    expect(
      mamdaniInference(
        employmentExample.inputs,
        employmentExample.outputs,
        employmentExample.rules,
        {
          height: 180,
          age: 40,
        },
        DefuzzicationType.LargestOfMaxima
      )
    ).toBe(6);

    expect(
      mamdaniInference(
        employmentExample.inputs,
        employmentExample.outputs,
        employmentExample.rules,
        {
          height: 180,
          age: 40,
        },
        DefuzzicationType.MeanOfMaxima
      )
    ).toBe(5);

    expect(
      mamdaniInference(
        employmentExample.inputs,
        employmentExample.outputs,
        employmentExample.rules,
        {
          height: 180,
          age: 40,
        },
        DefuzzicationType.Centroid
      )
    ).toBe(6);
  });
});
