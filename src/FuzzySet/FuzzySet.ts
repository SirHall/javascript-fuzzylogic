import { DefuzzicationType, defuzzify } from '../defuzzify';
import {
  MembershipFunction,
  MembershipFunctionParameters,
  generateMembershipValues,
} from '../membershipFunction';
import {
  FuzzyValue,
  alphacut,
  complement,
  getPlottableValues,
  height,
  intersection,
  isNormal,
  support,
  union,
} from './index';

export class FuzzySet {
  readonly name: string;
  values: FuzzyValue[];

  constructor(name: string, initialValues: FuzzyValue[] = []) {
    this.name = name;
    this.values = initialValues;
  }

  alphacut = (alpha: number, strong?: boolean) => alphacut(this, alpha, strong);

  support = () => support(this);

  height = () => height(this);

  isNormal = () => isNormal(this);

  complement = () => complement(this);

  union = (fuzzySet: FuzzySet) => union(this, fuzzySet);

  intersection = (fuzzySet: FuzzySet) => intersection(this, fuzzySet);

  generateMembershipValues<T extends keyof MembershipFunctionParameters>(mf: MembershipFunction<T>) {
    this.values = generateMembershipValues<T>(mf);
    return this.values;
  }

  defuzzify = (type: DefuzzicationType): number => defuzzify(type, this.values);

  getPlottableValues = () => getPlottableValues(this);
}
