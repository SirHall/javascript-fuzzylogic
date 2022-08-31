import { LinguisticRule } from './LinguisticRule';
import { LinguisticRuleOperator } from './types';
import { Antecedent, Consequent } from '.';

const operator: LinguisticRuleOperator = 'AND';
const antecedents: Antecedent[] = [
  {
    linguisticVariable: 'Food',
    fuzzySet: 'Good',
  },
  {
    linguisticVariable: 'Service',
    fuzzySet: 'Good',
  },
];
const consequent: Consequent = {
  linguisticVariable: 'Tip',
  fuzzySet: 'Good',
};

describe('LinguisticRule', () => {
  it('should be able to initialise with antecedents and a consequent', () => {
    const r = new LinguisticRule(operator, antecedents, consequent);
    expect(r.antecedents).toHaveLength(2);
    expect(r.consequent).toBeDefined();
    expect(r.operator).toBe('AND');
  });

  it('should be able to print itself in plain english', () => {
    const r = new LinguisticRule(operator, antecedents, consequent);
    expect(r.prettyPrint()).toBe('IF Food IS Good AND Service IS Good THEN Tip IS Good');
  });
});
