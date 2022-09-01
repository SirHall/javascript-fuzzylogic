import { FuzzySet } from './FuzzySet';
import { FuzzyInferenceSystem, LinguisticVariable } from './index';
import { MembershipFunctionType } from './membershipFunction';

const poorServiceMf = new FuzzySet('Poor').generateMembershipValues({
  type: MembershipFunctionType.Gaussian,
  parameters: {
    center: 0,
    standardDeviation: 1.5,
    minValue: 0,
    maxValue: 10,
    step: 0.5,
  },
});
const goodServiceMf = new FuzzySet('Good').generateMembershipValues({
  type: MembershipFunctionType.Gaussian,
  parameters: {
    center: 5,
    standardDeviation: 1.5,
    minValue: 0,
    maxValue: 10,
    step: 0.5,
  },
});
const excellentServiceMf = new FuzzySet('Excellent').generateMembershipValues({
  type: MembershipFunctionType.Gaussian,
  parameters: {
    center: 10,
    standardDeviation: 1.5,
    minValue: 0,
    maxValue: 10,
    step: 0.5,
  },
});

const rancidFoodMf = new FuzzySet('Rancid').generateMembershipValues({
  type: MembershipFunctionType.Trapezoidal,
  parameters: {
    bottomLeft: 0,
    topLeft: 0,
    topRight: 1,
    bottomRight: 3,
    minValue: 0,
    maxValue: 10,
    step: 0.5,
  },
});
const deliciousFoodMf = new FuzzySet('Delicious').generateMembershipValues({
  type: MembershipFunctionType.Trapezoidal,
  parameters: {
    bottomLeft: 7,
    topLeft: 9,
    topRight: 10,
    bottomRight: 10,
    minValue: 0,
    maxValue: 10,
    step: 0.5,
  },
});

const cheapTipMf = new FuzzySet('Cheap').generateMembershipValues({
  type: MembershipFunctionType.Triangular,
  parameters: {
    left: 0,
    center: 5,
    right: 10,
    minValue: 0,
    maxValue: 30,
    step: 0.5,
  },
});
const averageTipMf = new FuzzySet('Average').generateMembershipValues({
  type: MembershipFunctionType.Triangular,
  parameters: {
    left: 10,
    center: 15,
    right: 20,
    minValue: 0,
    maxValue: 30,
    step: 0.5,
  },
});
const generousTipMf = new FuzzySet('Generous').generateMembershipValues({
  type: MembershipFunctionType.Triangular,
  parameters: {
    left: 20,
    center: 25,
    right: 30,
    minValue: 0,
    maxValue: 30,
    step: 0.5,
  },
});

export const serviceVariable = new LinguisticVariable('Service')
  .addSet(poorServiceMf)
  .addSet(goodServiceMf)
  .addSet(excellentServiceMf);
export const foodVariable = new LinguisticVariable('Food').addSet(rancidFoodMf).addSet(deliciousFoodMf);
export const tipVariable = new LinguisticVariable('Tip')
  .addSet(cheapTipMf)
  .addSet(averageTipMf)
  .addSet(generousTipMf);

export const tipper = new FuzzyInferenceSystem('Tipper test')
  .addInput(serviceVariable)
  .addInput(foodVariable)
  .addOutput(tipVariable)
  .addRule('IF Food IS Rancid OR Service IS Poor THEN Tip IS Cheap')
  .addRule('IF Service IS Good THEN Tip IS Average')
  .addRule('IF Food IS Delicious OR Service IS Excellent THEN Tip IS Generous');
