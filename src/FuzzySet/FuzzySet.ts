import { DefuzzicationType, defuzzify } from '../defuzzify';
import {
  GenericMembershipFunctionParameters,
  MembershipFunction,
  MembershipFunctionParameters,
  MembershipFunctionType,
  generateMembershipValues,
} from '../membershipFunction';
import {
  FuzzyValue,
  alphacut,
  complement,
  getMembershipValue,
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
  initialisationParameters?: GenericMembershipFunctionParameters;
  membershipFunctionType?: MembershipFunctionType;

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
    this.membershipFunctionType = mf.type;
    this.initialisationParameters = mf.parameters;
    return this;
  }

  defuzzify = (type: DefuzzicationType): number => defuzzify(type, this.values);

  getPlottableValues = () => getPlottableValues(this);

  getMembership = (xValue: number) => getMembershipValue(this, xValue);
}
