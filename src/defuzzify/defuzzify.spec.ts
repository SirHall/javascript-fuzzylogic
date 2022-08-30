import { FuzzySet, FuzzyValue } from '../FuzzySet';
import { centroid, defuzzify, getMaxima, largestOfMaxima, meanOfMaxima, smallestOfMaxima } from './defuzzify';
import { DefuzzicationType } from './types';

const values: FuzzyValue[] = [
  { membership: 0.0, value: 0 },
  { membership: 0.0, value: 10 },
  { membership: 0.0, value: 20 },
  { membership: 0.25, value: 30 },
  { membership: 1, value: 40 },
  { membership: 1, value: 50 },
  { membership: 1, value: 60 },
  { membership: 0.5, value: 70 },
  { membership: 0.5, value: 80 },
  { membership: 0.5, value: 90 },
  { membership: 0, value: 100 },
];
const fuzzySet = new FuzzySet('Test set', values);

const smallerValues = [
  { membership: 0.0, value: 1 },
  { membership: 0.1, value: 2 },
  { membership: 0.7, value: 3 },
  { membership: 0.6, value: 4 },
  { membership: 0.7, value: 5 },
  { membership: 0.4, value: 6 },
  { membership: 0.1, value: 7 },
];

describe('defuzzify', () => {
  it('should defuzzify via centroid', () => {
    expect(defuzzify(DefuzzicationType.Centroid, smallerValues)).toBe(4.346153846153847);
    expect(defuzzify(DefuzzicationType.Centroid, fuzzySet.values)).toBe(58.421052631578945);
  });

  it('should defuzzify via mean of maxima', () => {
    expect(defuzzify(DefuzzicationType.MeanOfMaxima, smallerValues)).toBe(4);
    expect(defuzzify(DefuzzicationType.MeanOfMaxima, fuzzySet.values)).toBe(50);
  });

  it('should defuzzify via largest of maxima', () => {
    expect(defuzzify(DefuzzicationType.LargestOfMaxima, smallerValues)).toBe(5);
    expect(defuzzify(DefuzzicationType.LargestOfMaxima, fuzzySet.values)).toBe(60);
  });

  it('should defuzzify via smallest of maxima', () => {
    expect(defuzzify(DefuzzicationType.SmallestOfMaxima, smallerValues)).toBe(3);
    expect(defuzzify(DefuzzicationType.SmallestOfMaxima, fuzzySet.values)).toBe(40);
  });
});

describe('getMaxima', () => {
  it('should return the maxima for a given fuzzy set', () => {
    expect(getMaxima(fuzzySet.values)).toStrictEqual([
      { membership: 1, value: 40 },
      { membership: 1, value: 50 },
      { membership: 1, value: 60 },
    ]);
  });
});

describe('centroid', () => {
  it('should return the balance point of the shape', () => {
    expect(centroid(fuzzySet.values)).toBe(58.421052631578945);
  });
});

describe('meanOfMaxima', () => {
  it('should return the average value of those with the highest membership', () => {
    expect(meanOfMaxima(fuzzySet.values)).toBe(50);
  });
});

describe('smallestOfMaxima', () => {
  it('should return the smallest value with the highest membership', () => {
    expect(smallestOfMaxima(fuzzySet.values)).toBe(40);
  });
});

describe('largestOfMaxima', () => {
  it('should return the largest value with the highest membership', () => {
    expect(largestOfMaxima(fuzzySet.values)).toBe(60);
  });
});
