import { FuzzySet } from '../FuzzySet';
import { MembershipFunctionType } from '../membershipFunction';
import { LinguisticVariable } from './LinguisticVariable';

const poorService = new FuzzySet('Poor').generateMembershipValues({
  type: MembershipFunctionType.Gaussian,
  parameters: {
    center: 0,
    standardDeviation: 1.5,
    minValue: 0,
    maxValue: 10,
    step: 0.5,
  },
});

const goodService = new FuzzySet('Good').generateMembershipValues({
  type: MembershipFunctionType.Gaussian,
  parameters: {
    center: 5,
    standardDeviation: 1.5,
    minValue: 0,
    maxValue: 10,
    step: 0.5,
  },
});

const greatService = new FuzzySet('Great').generateMembershipValues({
  type: MembershipFunctionType.Gaussian,
  parameters: {
    center: 10,
    standardDeviation: 1.5,
    minValue: 0,
    maxValue: 10,
    step: 0.5,
  },
});

describe('LinguisticVariable', () => {
  it('should able to be created with no sets', () => {
    const service = new LinguisticVariable('Service');
    expect(service.fuzzySets).toHaveLength(0);
    expect(service.name).toBe('Service');
  });

  it('should be able to be created with some fuzzy sets', () => {
    const service = new LinguisticVariable('Service', [poorService, goodService]);
    expect(service.fuzzySets).toHaveLength(2);
  });

  it('should be able to be add sets', () => {
    const service = new LinguisticVariable('Service');
    expect(service.fuzzySets).toHaveLength(0);

    service.addSet(poorService);
    service.addSet(goodService);
    expect(service.fuzzySets).toHaveLength(2);
  });

  it('should be able to retrieve sets attached to it', () => {
    const service = new LinguisticVariable('Service', [poorService, goodService]);
    const set = service.getSet('Poor');
    expect(set.name).toBe('Poor');
  });

  it('should error if a non existant set is attempted to be retrieved', () => {
    const service = new LinguisticVariable('Service', [poorService, goodService]);
    expect(() => service.getSet('Fail')).toThrowError('No set with that name exists');
  });

  it('should be able to chain add fuzzy sets', () => {
    const service = new LinguisticVariable('Service').addSet(poorService).addSet(goodService);
    expect(service.fuzzySets).toHaveLength(2);
  });

  it('should error if two sets with the same name are added', () => {
    const service = new LinguisticVariable('Service').addSet(poorService);
    expect(() => service.addSet(poorService)).toThrowError('A set with that name already exists');
  });

  it('should allow for removal of sets', () => {
    const service = new LinguisticVariable('Service').addSet(poorService).addSet(goodService);
    expect(service.fuzzySets).toHaveLength(2);

    service.removeSet('Poor');
    expect(service.fuzzySets).toHaveLength(1);
    expect(service.fuzzySets[0].name).toBe('Good');
  });

  it('should allow editing of sets', () => {
    const service = new LinguisticVariable('Service')
      .addSet(poorService)
      .addSet(goodService)
      .addSet(greatService);

    const good = service.fuzzySets[1];
    expect(good.name).toBe('Good');
    expect(good.initialisationParameters).toStrictEqual({
      center: 5,
      standardDeviation: 1.5,
      minValue: 0,
      maxValue: 10,
      step: 0.5,
    });

    service.editSet(
      'Good',
      new FuzzySet('Good (editted)').generateMembershipValues({
        type: MembershipFunctionType.Gaussian,
        parameters: {
          center: 10,
          standardDeviation: 1.5,
          minValue: 0,
          maxValue: 10,
          step: 0.5,
        },
      })
    );

    const goodEditted = service.fuzzySets[1];
    expect(goodEditted.name).toBe('Good (editted)');
    expect(goodEditted.initialisationParameters).toStrictEqual({
      center: 10,
      standardDeviation: 1.5,
      minValue: 0,
      maxValue: 10,
      step: 0.5,
    });
  });
});
