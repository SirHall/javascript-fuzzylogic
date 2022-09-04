import { FuzzyInferenceSystem } from './FuzzyInferenceSystem';
import { FuzzySet } from './FuzzySet';
import { LinguisticVariable } from './LinguisticVariable';
import { MembershipFunctionType } from './membershipFunction';
import { tipper } from './tipperExample';
import { DefuzzicationType } from '.';

describe('scenario', () => {
  it('should not NaN', () => {
    const f = new FuzzyInferenceSystem('Tipper');

    f.addInput(tipper.inputs[0]).addInput(tipper.inputs[1]);
    f.addOutput(
      new LinguisticVariable('Tip')
        .addSet(
          new FuzzySet('Cheap').generateMembershipValues({
            type: MembershipFunctionType.Triangular,
            parameters: {
              left: 0,
              center: 0,
              right: 15,
              minValue: 0,
              maxValue: 30,
              step: 0.5,
            },
          })
        )
        .addSet(
          new FuzzySet('Average').generateMembershipValues({
            type: MembershipFunctionType.Triangular,
            parameters: {
              left: 7.5,
              center: 15,
              right: 22.5,
              minValue: 0,
              maxValue: 30,
              step: 0.5,
            },
          })
        )
        .addSet(
          new FuzzySet('Generous').generateMembershipValues({
            type: MembershipFunctionType.Triangular,
            parameters: {
              left: 15,
              center: 30,
              right: 30,
              minValue: 0,
              maxValue: 30,
              step: 0.5,
            },
          })
        )
    );
    f.addRule(tipper.rules[0].prettyPrint())
      .addRule(tipper.rules[1].prettyPrint())
      .addRule(tipper.rules[2].prettyPrint());
    expect(f.solve('Mamdani', { Food: 5, Service: 5 }, DefuzzicationType.Centroid)).not.toBeNaN();
  });
});
