import { FuzzySet } from '../FuzzySet';

export class LinguisticVariable {
  readonly name: string;
  fuzzySets: FuzzySet[];
  indexedFuzzySets: { [key: string]: FuzzySet } = {};

  constructor(name: string, fuzzySets: FuzzySet[] = []) {
    this.name = name;
    this.fuzzySets = fuzzySets;
    this.indexSets();
  }

  indexSets = () => {
    this.indexedFuzzySets = this.fuzzySets.reduce(
      (acc, fuzzySet) => ({
        ...acc,
        [fuzzySet.name]: fuzzySet,
      }),
      {}
    );
  };

  addSet = (set: FuzzySet) => {
    if (this.indexedFuzzySets[set.name] !== undefined) {
      throw new Error('A set with that name already exists');
    }
    this.fuzzySets.push(set);
    this.indexedFuzzySets[set.name] = set;
    return this;
  };

  getSet = (name: string) => {
    if (this.indexedFuzzySets[name] === undefined) {
      throw new Error('No set with that name exists');
    }
    return this.indexedFuzzySets[name];
  };

  removeSet = (name: string) => {
    this.fuzzySets = this.fuzzySets.filter((set) => set.name !== name);
    this.indexSets();
    return this;
  };

  editSet = (name: string, newSet: FuzzySet) => {
    const i = this.fuzzySets.findIndex((set) => set.name === name);
    this.fuzzySets = [
      ...this.fuzzySets.slice(0, i),
      newSet,
      ...this.fuzzySets.slice(i + 1, this.fuzzySets.length),
    ];
    this.indexSets();
    return this;
  };
}
