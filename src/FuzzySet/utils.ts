import { FuzzySet, FuzzyValue } from './index';

/*
 * An α-cut of a fuzzy set, A, is a crisp set, Aα, that contains all elements of A,
 * with membership greater than or equal to the specified value of α.
 * A *strong* α-cut is the same, but only those values that have membership greater
 * than α, instead of those greater or equal.
 */
export const alphacut = (set: FuzzySet, alpha: number, strong: boolean = false): number[] =>
  set.values
    .filter((fuzzyValue) => (strong ? fuzzyValue.membership > alpha : fuzzyValue.membership >= alpha))
    .map(({ value }) => value);

/**
 * The support of a fuzzy set, A, is a strong α-cut of A, where α = 0.
 * Thus, the support of a fuzzy set is all non zero values of that set.
 */
export const support = (set: FuzzySet): number[] => alphacut(set, 0, true);

/**
 * The height of a fuzzy set is the largest membership grade attained by any
 * element of that set.
 */
export const height = (set: FuzzySet): number => {
  if (set.values.length === 0) {
    throw new Error('Cannot process, this set has no values');
  }
  return set.values.reduce<number>((acc, { membership }) => (membership > acc ? membership : acc), 0);
};

/**
 * A fuzzy set is said to be normalised if at least one its elements attains the
 * maximum possible membership grade (of 1).
 */
export const isNormal = (set: FuzzySet): boolean => height(set) === 1;

/*
 * A set is convex if we cannot draw a line from two points on
 * the set that cross the set at any point.
 */
export const isConvex = (set: FuzzySet): boolean => {
  throw new Error('Not yet implemented');
};

/*
 * The complement,of a fuzzy set is a fuzzy set in which the value of membership
 * for each member is (1 - μ) (where μ is the membership grade in the original set)
 */
export const complement = (set: FuzzySet): FuzzyValue[] =>
  set.values.map(({ value, membership }) => ({
    value,
    membership: (1000 - membership * 1000) / 1000,
  }));

/**
 * The union of two fuzzy sets, A and B, is a new fuzzy set with all values
 * with the minimum membership value
 */
export const intersection = (setA: FuzzySet, setB: FuzzySet): FuzzyValue[] => {
  // Check both sets are of the same length
  if (setA.values.length !== setB.values.length) {
    throw new Error('Sets do not have the same length');
  }

  // Check both sets have matching x values
  if (
    JSON.stringify(setA.values.map(({ value }) => value)) !==
    JSON.stringify(setB.values.map(({ value }) => value))
  ) {
    throw new Error(
      'Sets do not have matching x values (make sure minValue, maxValue and step are the same)'
    );
  }

  const setAindexedByXValue = indexByXValue(setA.values);
  const setBindexedByXValue = indexByXValue(setB.values);
  return Object.keys(setAindexedByXValue).map((key) => {
    const numericKey = parseInt(key, 10);
    return setAindexedByXValue[numericKey] < setBindexedByXValue[numericKey]
      ? { membership: setAindexedByXValue[numericKey], value: numericKey }
      : { membership: setBindexedByXValue[numericKey], value: numericKey };
  });
};

/**
 * The union of two fuzzy sets, A and B, is a new fuzzy set with all values
 * with the maximum membership value
 */
export const union = (setA: FuzzySet, setB: FuzzySet): FuzzyValue[] => {
  // Check both sets are of the same length
  if (setA.values.length !== setB.values.length) {
    throw new Error('Sets do not have the same length');
  }

  // Check both sets have matching x values
  if (
    JSON.stringify(setA.values.map(({ value }) => value)) !==
    JSON.stringify(setB.values.map(({ value }) => value))
  ) {
    throw new Error(
      'Sets do not have matching x values (make sure minValue, maxValue and step are the same)'
    );
  }

  const setAindexedByXValue = indexByXValue(setA.values);
  const setBindexedByXValue = indexByXValue(setB.values);
  return Object.keys(setAindexedByXValue).map((key) => {
    const numericKey = parseInt(key, 10);
    return setAindexedByXValue[numericKey] > setBindexedByXValue[numericKey]
      ? { membership: setAindexedByXValue[numericKey], value: numericKey }
      : { membership: setBindexedByXValue[numericKey], value: numericKey };
  });
};

/**
 * Given a array of fuzzy values, return them as an object indexed by their `x` value
 */
export const indexByXValue = (values: FuzzyValue[]): { [key: number]: number } =>
  values.reduce(
    (acc, { value, membership }) => ({
      ...acc,
      [value]: membership,
    }),
    {}
  );

/**
 * For a fuzzy set, return two arrays: the x values, and the membership values,
 * so that they can be plotted on a graph
 */
export const getPlottableValues = (set: FuzzySet): { xValues: number[]; membershipValues: number[] } =>
  set.values.reduce<{ xValues: number[]; membershipValues: number[] }>(
    (acc, { membership, value }) => {
      return {
        xValues: [...acc.xValues, value],
        membershipValues: [...acc.membershipValues, membership],
      };
    },
    {
      xValues: [],
      membershipValues: [],
    }
  );

/**
 * For a given x value, find the membership value it possesses
 */
export const getMembershipValue = (set: FuzzySet, xValue: number) =>
  set.values.find(({ value }) => value === xValue)?.membership;
