import {
  FuzzySet,
  FuzzyValue,
  alphacut,
  complement,
  getMembershipValue,
  height,
  intersection,
  isNormal,
  support,
  union,
} from './index';
import { indexByXValue } from './utils';
import { MembershipFunctionType, TriangularMembershipFunctionParams, getPlottableValues } from '..';

const values: FuzzyValue[] = [
  { membership: 0.0, value: 1 },
  { membership: 0.1, value: 2 },
  { membership: 0.7, value: 3 },
  { membership: 0.6, value: 4 },
  { membership: 0.7, value: 5 },
  { membership: 0.4, value: 6 },
  { membership: 0.1, value: 7 },
];
const setWithValues = new FuzzySet('setWithValues', values);
const setWithNoValues = new FuzzySet('setWithNoValues', []);
const normalisedSet = new FuzzySet('normalisedSet', [...values, { membership: 1, value: 8 }]);

describe('FuzzySet', () => {
  it('should store initialisation parameters if a membership function is used', () => {
    const f1 = new FuzzySet('Fuzzy set');
    expect(f1.initialisationParameters).toBe(undefined);
    expect(f1.membershipFunctionType).toBe(undefined);

    const initParams = {
      type: MembershipFunctionType.Triangular,
      parameters: {
        left: 0,
        center: 5,
        right: 10,
        minValue: 0,
        maxValue: 10,
        step: 1,
      },
    };
    f1.generateMembershipValues(initParams);
    expect(f1.initialisationParameters).toStrictEqual(initParams.parameters);
    expect(f1.membershipFunctionType).toBe(initParams.type);
  });
});

describe('alphacut', () => {
  it('should return empty array if the fuzzy set has no values', () => {
    expect(alphacut(setWithNoValues, 0.2)).toStrictEqual([]);
    expect(alphacut(setWithNoValues, 0.6)).toStrictEqual([]);
    expect(alphacut(setWithNoValues, 1)).toStrictEqual([]);
    expect(setWithNoValues.alphacut(0.2)).toStrictEqual([]);
  });
  it('should return all values with greater or equal membership than the alpha', () => {
    expect(alphacut(setWithValues, 0.2)).toStrictEqual([3, 4, 5, 6]);
    expect(alphacut(setWithValues, 0.6)).toStrictEqual([3, 4, 5]);
    expect(alphacut(setWithValues, 1)).toStrictEqual([]);
    expect(setWithValues.alphacut(0.2)).toStrictEqual([3, 4, 5, 6]);
  });
  it('should return all values with greater member than the alpha, if strong is specified', () => {
    expect(alphacut(setWithValues, 0.2, true)).toStrictEqual([3, 4, 5, 6]);
    expect(alphacut(setWithValues, 0.6, true)).toStrictEqual([3, 5]);
    expect(alphacut(setWithValues, 1, true)).toStrictEqual([]);
    expect(setWithValues.alphacut(0.2, true)).toStrictEqual([3, 4, 5, 6]);
  });
});

describe('support', () => {
  it('should return empty array if the fuzzy set has no values', () => {
    expect(support(setWithNoValues)).toStrictEqual([]);
    expect(setWithNoValues.support()).toStrictEqual([]);
  });
  it('should return all values with greater member than 0', () => {
    expect(support(setWithValues)).toStrictEqual([2, 3, 4, 5, 6, 7]);
    expect(setWithValues.support()).toStrictEqual([2, 3, 4, 5, 6, 7]);
  });
});

describe('height', () => {
  it('should return an error if an empty values array is used', () => {
    expect(() => height(setWithNoValues)).toThrowError('Cannot process, this set has no values');
    expect(() => setWithNoValues.height()).toThrowError('Cannot process, this set has no values');
  });

  it('should return the highest membership for a given fuzzy set', () => {
    expect(height(setWithValues)).toStrictEqual(0.7);
    expect(setWithValues.height()).toStrictEqual(0.7);
    expect(height(normalisedSet)).toStrictEqual(1);
    expect(normalisedSet.height()).toStrictEqual(1);
  });
});

describe('isNormal', () => {
  it('should return an error if an empty values array is used', () => {
    expect(() => isNormal(setWithNoValues)).toThrowError('Cannot process, this set has no values');
    expect(() => setWithNoValues.isNormal()).toThrowError('Cannot process, this set has no values');
  });

  it('should return true if the highest membership grade of a set is 1', () => {
    expect(isNormal(normalisedSet)).toStrictEqual(true);
    expect(normalisedSet.isNormal()).toStrictEqual(true);
  });

  it('should return false if the highest membership grade of a set is not 1', () => {
    expect(isNormal(setWithValues)).toStrictEqual(false);
    expect(setWithValues.isNormal()).toStrictEqual(false);
  });
});

describe('complement', () => {
  it('should return an empty set if no values are provided', () => {
    expect(complement(setWithNoValues)).toStrictEqual([]);
    expect(setWithNoValues.complement()).toStrictEqual([]);
  });
  it('should return a new set of values with 1-m of the original set', () => {
    const result = [
      { membership: 1, value: 1 },
      { membership: 0.9, value: 2 },
      { membership: 0.3, value: 3 },
      { membership: 0.4, value: 4 },
      { membership: 0.3, value: 5 },
      { membership: 0.6, value: 6 },
      { membership: 0.9, value: 7 },
    ];
    expect(complement(setWithValues)).toStrictEqual(result);
    expect(setWithValues.complement()).toStrictEqual(result);
  });
});

const middleAged = new FuzzySet('middleAged', [
  {
    membership: 0,
    value: 0,
  },
  {
    membership: 0,
    value: 10,
  },
  {
    membership: 0,
    value: 20,
  },
  {
    membership: 0.5,
    value: 30,
  },
  {
    membership: 1,
    value: 40,
  },
  {
    membership: 0.5,
    value: 50,
  },
  {
    membership: 0,
    value: 60,
  },
  {
    membership: 0,
    value: 70,
  },
  {
    membership: 0,
    value: 80,
  },
]);

const young = new FuzzySet('young', [
  {
    membership: 1,
    value: 0,
  },
  {
    membership: 1,
    value: 10,
  },
  {
    membership: 1,
    value: 20,
  },
  {
    membership: 0.5,
    value: 30,
  },
  {
    membership: 0,
    value: 40,
  },
  {
    membership: 0,
    value: 50,
  },
  {
    membership: 0,
    value: 60,
  },
  {
    membership: 0,
    value: 70,
  },
  {
    membership: 0,
    value: 80,
  },
]);

describe('union', () => {
  it('should return an error if sets are not of equal length', () => {
    const badYoungValues = Array.from(young.values).slice(0, 3);
    const badYoungSet = new FuzzySet('Bad young', badYoungValues);
    expect(() => union(badYoungSet, middleAged)).toThrowError('Sets do not have the same length');
  });

  it('should return an error if sets do not have the same x values', () => {
    const badYoungSet = new FuzzySet('Bad young', [{ membership: 1, value: -5 }, ...young.values]);
    const badMiddleAgeSet = new FuzzySet('Bad young', [{ membership: 1, value: -1 }, ...young.values]);

    expect(() => union(badYoungSet, badMiddleAgeSet)).toThrowError(
      'Sets do not have matching x values (make sure minValue, maxValue and step are the same)'
    );
  });

  it('should return union of two fuzzy sets', () => {
    expect(union(young, middleAged)).toStrictEqual([
      { membership: 1, value: 0 },
      { membership: 1, value: 10 },
      { membership: 1, value: 20 },
      { membership: 0.5, value: 30 },
      { membership: 1, value: 40 },
      { membership: 0.5, value: 50 },
      { membership: 0, value: 60 },
      { membership: 0, value: 70 },
      { membership: 0, value: 80 },
    ]);
  });
});

describe('intersection', () => {
  it('should return an error if sets are not of equal length', () => {
    const badYoungValues = Array.from(young.values).slice(0, 3);
    const badYoungSet = new FuzzySet('Bad young', badYoungValues);
    expect(() => intersection(badYoungSet, middleAged)).toThrowError('Sets do not have the same length');
  });

  it('should return an error if sets do not have the same x values', () => {
    const badYoungSet = new FuzzySet('Bad young', [{ membership: 1, value: -5 }, ...young.values]);
    const badMiddleAgeSet = new FuzzySet('Bad young', [{ membership: 1, value: -1 }, ...young.values]);

    expect(() => intersection(badYoungSet, badMiddleAgeSet)).toThrowError(
      'Sets do not have matching x values (make sure minValue, maxValue and step are the same)'
    );
  });

  it('should return intersection of two fuzzy sets', () => {
    expect(intersection(young, middleAged)).toStrictEqual([
      { membership: 0, value: 0 },
      { membership: 0, value: 10 },
      { membership: 0, value: 20 },
      { membership: 0.5, value: 30 },
      { membership: 0, value: 40 },
      { membership: 0, value: 50 },
      { membership: 0, value: 60 },
      { membership: 0, value: 70 },
      { membership: 0, value: 80 },
    ]);
  });
});

describe('indexByXValue', () => {
  it('should index by x value', () => {
    expect(indexByXValue(young.values)).toStrictEqual({
      '0': 1,
      '10': 1,
      '20': 1,
      '30': 0.5,
      '40': 0,
      '50': 0,
      '60': 0,
      '70': 0,
      '80': 0,
    });
  });
});

describe('getPlottableValues', () => {
  it('should return two empty arrays for an empty fuzzy set', () => {
    expect(getPlottableValues(setWithNoValues)).toStrictEqual({
      xValues: [],
      membershipValues: [],
    });
  });

  it('should return two arrays for a given fuzzy set', () => {
    expect(getPlottableValues(setWithValues)).toStrictEqual({
      membershipValues: [0, 0.1, 0.7, 0.6, 0.7, 0.4, 0.1],
      xValues: [1, 2, 3, 4, 5, 6, 7],
    });
  });
});

describe('getMembershipValue', () => {
  it('should return the undefined if the xValue does not exist', () => {
    expect(getMembershipValue(setWithNoValues, 1)).toBe(undefined);
    expect(setWithNoValues.getMembership(1)).toBe(undefined);
  });

  it('should return the membership value if that xValue exists', () => {
    expect(getMembershipValue(setWithValues, 1)).toBe(0);
    expect(setWithValues.getMembership(1)).toBe(0);
  });
});
