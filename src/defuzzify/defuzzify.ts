import { FuzzyValue } from '../FuzzySet';
import { DefuzzicationType } from './types';

/**
 * Applies a defuzzification method (defined below) to an array of fuzzy values
 */
export const defuzzify = (type: DefuzzicationType, values: FuzzyValue[]): number => {
  switch (type) {
    case DefuzzicationType.Centroid:
      return centroid(values);
    case DefuzzicationType.MeanOfMaxima:
      return meanOfMaxima(values);
    case DefuzzicationType.SmallestOfMaxima:
      return smallestOfMaxima(values);
    case DefuzzicationType.LargestOfMaxima:
      return largestOfMaxima(values);
    default:
      throw new Error('Unexpected defuzzification type');
  }
};

/**
 * Gets all fuzzy values with maximum membership in the given set
 */
export const getMaxima = (values: FuzzyValue[]): FuzzyValue[] => {
  const membershipMaxima = values.reduce((acc, { membership }) => (membership > acc ? membership : acc), 0);
  return values.filter((fuzzyValue) => fuzzyValue.membership === membershipMaxima);
};

/**
 * The 'balance point' of the set, i.e, where the center of gravity
 * of the shape would be
 */
export const centroid = (values: FuzzyValue[]): number => {
  const sums = values.reduce(
    (acc, { value, membership }) => ({
      top: acc.top + membership * value,
      bottom: acc.bottom + membership,
    }),
    {
      top: 0,
      bottom: 0,
    }
  );

  return sums.top / sums.bottom;
};

/*
 * The average value of all values with the highest membership
 */
export const meanOfMaxima = (values: FuzzyValue[]): number => {
  const maxima = getMaxima(values);
  const sum = maxima.reduce((acc, { value }) => acc + value, 0);
  return sum / maxima.length;
};

/*
 * The smallest value of all values with the highest membership
 */
export const smallestOfMaxima = (values: FuzzyValue[]): number => getMaxima(values)[0].value;

/*
 * The largest value of all values with the highest membership
 */
export const largestOfMaxima = (values: FuzzyValue[]): number => {
  const maxima = getMaxima(values);
  return maxima[maxima.length - 1].value;
};
