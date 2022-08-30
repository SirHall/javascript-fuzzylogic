export enum MembershipFunctionType {
  Triangular = 'Triangular',
  Trapezoidal = 'Trapezoidal',
  Gaussian = 'Gaussian',
  Sigmoidal = 'Sigmoidal',
}

export interface TriangularMembershipFunctionParams {
  left: number;
  center: number;
  right: number;
}

export interface TrapezoidalMembershipFunctionParams {
  bottomLeft: number;
  topLeft: number;
  topRight: number;
  bottomRight: number;
}

export interface GaussianMembershipFunctionParams {
  center: number;
  standardDeviation: number;
}

export interface SigmoidalMembershipFunctionParams {
  center: number;
  slope: number;
}

export interface BaseMembershipFunctionParameters {
  minValue: number;
  maxValue: number;
  step: number;
}

export type GenericMembershipFunctionParameters =
  | TriangularMembershipFunctionParams
  | TrapezoidalMembershipFunctionParams
  | GaussianMembershipFunctionParams
  | SigmoidalMembershipFunctionParams;

export type MembershipFunctionParameters = {
  [MembershipFunctionType.Triangular]: TriangularMembershipFunctionParams;
  [MembershipFunctionType.Trapezoidal]: TrapezoidalMembershipFunctionParams;
  [MembershipFunctionType.Gaussian]: GaussianMembershipFunctionParams;
  [MembershipFunctionType.Sigmoidal]: SigmoidalMembershipFunctionParams;
};

export interface MembershipFunction<T extends keyof MembershipFunctionParameters> {
  type: T;
  parameters: MembershipFunctionParameters[T] & BaseMembershipFunctionParameters;
}
