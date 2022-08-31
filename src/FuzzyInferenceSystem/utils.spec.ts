import { employmentExample } from '../tipperExample';
import { mamdaniInference } from './utils';

describe.skip('mamdaniInference', () => {
  it('should return a single crisp value for a given fuzzy inference system', () => {
    expect(
      mamdaniInference(employmentExample.inputs, employmentExample.outputs, employmentExample.rules, {
        height: 180,
        age: 40,
      })
    ).toBe(0);
  });
});
