import { DefuzzicationType, defuzzify } from '../defuzzify';
import { FuzzySet, FuzzyValue } from '../FuzzySet';
import { LinguisticRule } from '../LinguisticRule';
import { LinguisticVariable } from '../LinguisticVariable';

export const mamdaniInference = (
  inputs: LinguisticVariable[],
  outputs: LinguisticVariable[],
  rules: LinguisticRule[],
  args: Record<string, number>,
  defuzzicationMethod: DefuzzicationType
): number => {
  // Create an indexed object for all the inputs and outputs
  const variables: Record<string, { [key: string]: FuzzySet }> = [...inputs, ...outputs].reduce(
    (acc, variable) => {
      return {
        ...acc,
        [variable.name]: variable.indexedFuzzySets,
      };
    },
    {}
  );

  // Check all args have corresponding variables
  Object.keys(args).forEach((variableName) => {
    if (variables[variableName] === undefined) {
      throw new Error(`Argument ${variableName} does not relate to any variable in the system`);
    }
  });

  const outputSets = rules.map((rule) => {
    // Get all membership values for the antecedents
    const inputMembershipValues: number[] = rule.antecedents.map(({ linguisticVariable, fuzzySet }) => {
      const variable = variables[linguisticVariable][fuzzySet];
      if (variable === undefined) {
        throw new Error(`Unable to find variable ${linguisticVariable} with set ${fuzzySet}`);
      }
      const value = variable.getMembership(args[linguisticVariable]);
      if (value === undefined) {
        throw new Error(
          `Unable to get find get membership for arg ${linguisticVariable} from ${linguisticVariable} with set ${fuzzySet}`
        );
      }
      return value;
    });

    // Use the operator (AND => Min, OR => Max) to get a single value
    const singleInputValue =
      rule.operator === 'AND' ? Math.min(...inputMembershipValues) : Math.max(...inputMembershipValues);

    // Create a new FuzzyValue[] that uses the minimum value from the singleInputValue or
    // the membership of each xValue in the output set
    return variables[rule.consequent.linguisticVariable][rule.consequent.fuzzySet].values.map(
      ({ value, membership }) => {
        return {
          value,
          membership: Math.min(singleInputValue, membership),
        };
      }
    );
  });

  // Combine all the output sets into a single set
  const singleOutputSet = combineSetsWithMaximum(outputSets);
  return defuzzify(defuzzicationMethod, singleOutputSet);
};

export const combineSetsWithMaximum = (sets: FuzzyValue[][]): FuzzyValue[] => {
  const firstSet = sets[0];
  const minimumOfSets = firstSet.map(({ value }, i) => {
    const membershipForAllSets = sets.map((set) => set[i].membership);
    return {
      value,
      membership: Math.max(...membershipForAllSets),
    };
  });
  return minimumOfSets;
};
