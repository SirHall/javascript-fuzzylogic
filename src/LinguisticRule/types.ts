export type LinguisticRuleOperator = 'AND' | 'OR';

interface BaseRuleParameter {
  linguisticVariable: string;
  fuzzySet: string;
}

export interface Antecedent extends BaseRuleParameter {}
export interface Consequent extends BaseRuleParameter {}
