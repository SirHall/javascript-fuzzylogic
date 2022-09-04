import { FuzzyValue, MembershipFunctionType } from '../index';
import {
  GaussianMembershipFunctionParams,
  MembershipFunction,
  MembershipFunctionParameters,
  SigmoidalMembershipFunctionParams,
  TrapezoidalMembershipFunctionParams,
  TriangularMembershipFunctionParams,
} from './types';

/**
 * Given a particular membership function definition, generate all values for that
 * membership function between the range given, at each step interval
 */
export function generateMembershipValues<T extends keyof MembershipFunctionParameters>(
  mf: MembershipFunction<T>
) {
  const { minValue, maxValue, step, ...rest } = mf.parameters;
  const values: FuzzyValue[] = [];

  const fn = (x: number): number => {
    switch (mf.type) {
      case MembershipFunctionType.Triangular:
        return triangularMembershipFunction(x, rest as unknown as TriangularMembershipFunctionParams);
      case MembershipFunctionType.Trapezoidal:
        return trapezoidalMembershipFunction(x, rest as unknown as TrapezoidalMembershipFunctionParams);
      case MembershipFunctionType.Gaussian:
        return gaussianMembershipFunction(x, rest as unknown as GaussianMembershipFunctionParams);
      case MembershipFunctionType.Sigmoidal:
        return sigmoidalMembershipFunction(x, rest as unknown as SigmoidalMembershipFunctionParams);
      default:
        throw new Error('Unexpected membership function type');
    }
  };

  for (let i = minValue; i <= maxValue; i += step) {
    values.push({
      value: i,
      membership: fn(i),
    });
  }

  return values;
}

/**
 * Generates a triangular shape.
 * All values before `left` are zero, `center` is one, and all values after `right` are zero
 */
export const triangularMembershipFunction = (
  xValue: number,
  { left, center, right }: TriangularMembershipFunctionParams
): number => {
  const values = [(xValue - left) / (center - left), (right - xValue) / (right - center)].filter(
    (value) => !isNaN(value)
  );
  return Math.max(Math.min(...values), 0);
};

/**
 * Generates a trapezoidal shape.
 * All values because `bottomLeft` are zero, `topLeft` to `topRight` is one, and all values
 * after `bottomRight` are zero
 */
export const trapezoidalMembershipFunction = (
  xValue: number,
  { bottomLeft, topLeft, topRight, bottomRight }: TrapezoidalMembershipFunctionParams
): number => {
  const values = [
    (xValue - bottomLeft) / (topLeft - bottomLeft),
    1,
    (bottomRight - xValue) / (bottomRight - topRight),
  ].filter((value) => !isNaN(value));

  return Math.max(Math.min(...values), 0);
};

/*
 * Generate a bell curve centered around `center`, and
 * width based on `standardDeviation`
 */
export const gaussianMembershipFunction = (
  xValue: number,
  { center, standardDeviation }: GaussianMembershipFunctionParams
): number => {
  return Math.exp(-0.5 * Math.pow((xValue - center) / standardDeviation, 2));
};

/*
 * Generate a curve with degree of slope, `slope`, center `half point`
 */
export const sigmoidalMembershipFunction = (
  xValue: number,
  { center, slope }: SigmoidalMembershipFunctionParams
): number => {
  return 1 / (1 + Math.exp(-slope * (xValue - center)));
};
