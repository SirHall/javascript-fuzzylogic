import { LinguisticRule } from '../LinguisticRule';
import { LinguisticVariable } from '../LinguisticVariable';

export const mamdaniInference = (
  inputs: LinguisticVariable[],
  outputs: LinguisticVariable[],
  rules: LinguisticRule[],
  args: Record<string, number>
): number => {
  console.log(args);
  console.log(rules[0]);

  // or is max

  const height = inputs.find((input) => input.name === 'Height');
  const age = inputs.find((input) => input.name === 'Age');
  const employ = outputs.find((input) => input.name === 'Employ');

  const mu_young = age?.indexedFuzzySets['young'].getMembership(args['age']);
  const mu_tall = height?.indexedFuzzySets['tall'].getMembership(args['height']);

  console.log(mu_young, mu_tall);

  const membership_1 =
    rules[0].operator === 'AND' ? Math.min(mu_young!, mu_tall!) : Math.max(mu_young!, mu_tall!);
  console.log(membership_1);

  // Create output comparison with value
  const output_set_1 = employ?.getSet('good').values.map(({ value, membership }) => {
    return {
      value,
      membership: Math.min(membership_1, membership),
    };
  });

  console.log(output_set_1);

  return 0;
};
