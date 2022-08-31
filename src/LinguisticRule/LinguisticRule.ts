import { Antecedent, Consequent, LinguisticRuleOperator } from './types';

export class LinguisticRule {
  readonly operator: LinguisticRuleOperator;
  readonly antecedents: Antecedent[];
  readonly consequent: Consequent;

  constructor(operator: LinguisticRuleOperator, antecedents: Antecedent[], consequent: Consequent) {
    this.operator = operator;
    this.antecedents = antecedents;
    this.consequent = consequent;
  }

  prettyPrint = () => {
    const antecedents = this.antecedents
      .map(({ linguisticVariable, fuzzySet }) => `${linguisticVariable} IS ${fuzzySet}`)
      .join(` ${this.operator} `);
    const consequent = `${this.consequent.linguisticVariable} IS ${this.consequent.fuzzySet}`;

    return `IF ${antecedents} THEN ${consequent}`;
  };
}
