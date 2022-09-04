import { FuzzySet, MembershipFunctionType } from '../index';
import {
  gaussianMembershipFunction,
  generateMembershipValues,
  sigmoidalMembershipFunction,
  trapezoidalMembershipFunction,
  triangularMembershipFunction,
} from './membershipFunction';

describe('generateMembershipValues', () => {
  it('should generate values for a triangular membership function', () => {
    const result = [
      {
        membership: 0,
        value: 0,
      },
      {
        membership: 0,
        value: 10,
      },
      {
        membership: 0,
        value: 20,
      },
      {
        membership: 0.25,
        value: 30,
      },
      {
        membership: 0.5,
        value: 40,
      },
      {
        membership: 0.75,
        value: 50,
      },
      {
        membership: 1,
        value: 60,
      },
      {
        membership: 0.5,
        value: 70,
      },
      {
        membership: 0,
        value: 80,
      },
      {
        membership: 0,
        value: 90,
      },
      {
        membership: 0,
        value: 100,
      },
    ];
    expect(
      generateMembershipValues({
        type: MembershipFunctionType.Triangular,
        parameters: {
          left: 20,
          center: 60,
          right: 80,
          minValue: 0,
          maxValue: 100,
          step: 10,
        },
      })
    ).toStrictEqual(result);
    expect(
      new FuzzySet('Test set').generateMembershipValues({
        type: MembershipFunctionType.Triangular,
        parameters: {
          left: 20,
          center: 60,
          right: 80,
          minValue: 0,
          maxValue: 100,
          step: 10,
        },
      }).values
    ).toStrictEqual(result);
  });

  it('should generate values for a trapezoidal membership function', () => {
    const result = [
      {
        membership: 0,
        value: 0,
      },
      {
        membership: 0,
        value: 10,
      },
      {
        membership: 1,
        value: 20,
      },
      {
        membership: 1,
        value: 30,
      },
      {
        membership: 1,
        value: 40,
      },
      {
        membership: 1,
        value: 50,
      },
      {
        membership: 1,
        value: 60,
      },
      {
        membership: 0.7142857142857143,
        value: 70,
      },
      {
        membership: 0.42857142857142855,
        value: 80,
      },
      {
        membership: 0.14285714285714285,
        value: 90,
      },
      {
        membership: 0,
        value: 100,
      },
    ];
    expect(
      generateMembershipValues({
        type: MembershipFunctionType.Trapezoidal,
        parameters: {
          bottomLeft: 10,
          topLeft: 20,
          topRight: 60,
          bottomRight: 95,
          minValue: 0,
          maxValue: 100,
          step: 10,
        },
      })
    ).toStrictEqual(result);
    expect(
      new FuzzySet('Test set').generateMembershipValues({
        type: MembershipFunctionType.Trapezoidal,
        parameters: {
          bottomLeft: 10,
          topLeft: 20,
          topRight: 60,
          bottomRight: 95,
          minValue: 0,
          maxValue: 100,
          step: 10,
        },
      }).values
    ).toStrictEqual(result);
  });

  it('should generate values for a gaussian membership function', () => {
    const result = [
      {
        membership: 0.04393693362340742,
        value: 0,
      },
      {
        membership: 0.1353352832366127,
        value: 10,
      },
      {
        membership: 0.32465246735834974,
        value: 20,
      },
      {
        membership: 0.6065306597126334,
        value: 30,
      },
      {
        membership: 0.8824969025845955,
        value: 40,
      },
      {
        membership: 1,
        value: 50,
      },
      {
        membership: 0.8824969025845955,
        value: 60,
      },
      {
        membership: 0.6065306597126334,
        value: 70,
      },
      {
        membership: 0.32465246735834974,
        value: 80,
      },
      {
        membership: 0.1353352832366127,
        value: 90,
      },
      {
        membership: 0.04393693362340742,
        value: 100,
      },
    ];
    expect(
      generateMembershipValues({
        type: MembershipFunctionType.Gaussian,
        parameters: {
          center: 50,
          standardDeviation: 20,
          minValue: 0,
          maxValue: 100,
          step: 10,
        },
      })
    ).toStrictEqual(result);
    expect(
      new FuzzySet('Test set').generateMembershipValues({
        type: MembershipFunctionType.Gaussian,
        parameters: {
          center: 50,
          standardDeviation: 20,
          minValue: 0,
          maxValue: 100,
          step: 10,
        },
      }).values
    ).toStrictEqual(result);
  });

  it('should generate values for a sigmoidal membership function', () => {
    const result = [
      {
        membership: 0.9999999999999065,
        value: -10,
      },
      {
        membership: 0.9999999999993086,
        value: -9,
      },
      {
        membership: 0.999999999994891,
        value: -8,
      },
      {
        membership: 0.9999999999622486,
        value: -7,
      },
      {
        membership: 0.9999999997210531,
        value: -6,
      },
      {
        membership: 0.9999999979388463,
        value: -5,
      },
      {
        membership: 0.9999999847700205,
        value: -4,
      },
      {
        membership: 0.9999998874648379,
        value: -3,
      },
      {
        membership: 0.9999991684719722,
        value: -2,
      },
      {
        membership: 0.9999938558253978,
        value: -1,
      },
      {
        membership: 0.9999546021312976,
        value: 0,
      },
      {
        membership: 0.9996646498695336,
        value: 1,
      },
      {
        membership: 0.9975273768433653,
        value: 2,
      },
      {
        membership: 0.9820137900379085,
        value: 3,
      },
      {
        membership: 0.8807970779778823,
        value: 4,
      },
      {
        membership: 0.5,
        value: 5,
      },
      {
        membership: 0.11920292202211755,
        value: 6,
      },
      {
        membership: 0.01798620996209156,
        value: 7,
      },
      {
        membership: 0.0024726231566347743,
        value: 8,
      },
      {
        membership: 0.0003353501304664781,
        value: 9,
      },
      {
        membership: 0.000045397868702434395,
        value: 10,
      },
    ];
    expect(
      generateMembershipValues({
        type: MembershipFunctionType.Sigmoidal,
        parameters: {
          slope: -2,
          center: 5,
          minValue: -10,
          maxValue: 10,
          step: 1,
        },
      })
    ).toStrictEqual(result);
    expect(
      new FuzzySet('Test set').generateMembershipValues({
        type: MembershipFunctionType.Sigmoidal,
        parameters: {
          slope: -2,
          center: 5,
          minValue: -10,
          maxValue: 10,
          step: 1,
        },
      }).values
    ).toStrictEqual(result);
  });
});

describe('triangularMembershipFunction', () => {
  it('should generate the correct value, for a given x value', () => {
    const parameters = { left: 20, center: 60, right: 80 };
    expect(triangularMembershipFunction(0, parameters)).toBe(0);
    expect(triangularMembershipFunction(10, parameters)).toBe(0);
    expect(triangularMembershipFunction(20, parameters)).toBe(0);
    expect(triangularMembershipFunction(30, parameters)).toBe(0.25);
    expect(triangularMembershipFunction(40, parameters)).toBe(0.5);
    expect(triangularMembershipFunction(50, parameters)).toBe(0.75);
    expect(triangularMembershipFunction(60, parameters)).toBe(1);
    expect(triangularMembershipFunction(70, parameters)).toBe(0.5);
    expect(triangularMembershipFunction(80, parameters)).toBe(0);
    expect(triangularMembershipFunction(90, parameters)).toBe(0);
    expect(triangularMembershipFunction(100, parameters)).toBe(0);
  });

  it('should return a value even if two parameters are the same', () => {
    const parameters = { left: 0, center: 0, right: 80 };
    expect(triangularMembershipFunction(0, parameters)).toBe(1);
    expect(triangularMembershipFunction(80, parameters)).toBe(0);
  });
});

describe('trapezoidalMembershipFunction', () => {
  it('should generate the correct value, for a given x value', () => {
    const parameters = { bottomLeft: 10, topLeft: 20, topRight: 60, bottomRight: 95 };
    expect(trapezoidalMembershipFunction(0, parameters)).toBe(0);
    expect(trapezoidalMembershipFunction(10, parameters)).toBe(0);
    expect(trapezoidalMembershipFunction(20, parameters)).toBe(1);
    expect(trapezoidalMembershipFunction(30, parameters)).toBe(1);
    expect(trapezoidalMembershipFunction(40, parameters)).toBe(1);
    expect(trapezoidalMembershipFunction(50, parameters)).toBe(1);
    expect(trapezoidalMembershipFunction(60, parameters)).toBe(1);
    expect(trapezoidalMembershipFunction(70, parameters)).toBe(0.7142857142857143);
    expect(trapezoidalMembershipFunction(80, parameters)).toBe(0.42857142857142855);
    expect(trapezoidalMembershipFunction(90, parameters)).toBe(0.14285714285714285);
    expect(trapezoidalMembershipFunction(100, parameters)).toBe(0);
  });

  it('should return a value even if two parameters are the same', () => {
    const parameters = { bottomLeft: 0, topLeft: 0, topRight: 60, bottomRight: 60 };
    expect(trapezoidalMembershipFunction(0, parameters)).toBe(1);
    expect(trapezoidalMembershipFunction(60, parameters)).toBe(1);
  });
});

describe('gaussianMembershipFunction', () => {
  it('should generate the correct value, for a given x value', () => {
    const parameters = { standardDeviation: 20, center: 50 };
    expect(gaussianMembershipFunction(0, parameters)).toBe(0.04393693362340742);
    expect(gaussianMembershipFunction(10, parameters)).toBe(0.1353352832366127);
    expect(gaussianMembershipFunction(20, parameters)).toBe(0.32465246735834974);
    expect(gaussianMembershipFunction(30, parameters)).toBe(0.6065306597126334);
    expect(gaussianMembershipFunction(40, parameters)).toBe(0.8824969025845955);
    expect(gaussianMembershipFunction(50, parameters)).toBe(1);
    expect(gaussianMembershipFunction(60, parameters)).toBe(0.8824969025845955);
    expect(gaussianMembershipFunction(70, parameters)).toBe(0.6065306597126334);
    expect(gaussianMembershipFunction(80, parameters)).toBe(0.32465246735834974);
    expect(gaussianMembershipFunction(90, parameters)).toBe(0.1353352832366127);
    expect(gaussianMembershipFunction(100, parameters)).toBe(0.04393693362340742);
  });
});

describe('sigmoidalMembershipFunction', () => {
  it('should generate the correct value, for a given x value', () => {
    const parameters = { slope: -2, center: 5 };
    expect(sigmoidalMembershipFunction(-10, parameters)).toBe(0.9999999999999065);
    expect(sigmoidalMembershipFunction(-9, parameters)).toBe(0.9999999999993086);
    expect(sigmoidalMembershipFunction(-8, parameters)).toBe(0.999999999994891);
    expect(sigmoidalMembershipFunction(-7, parameters)).toBe(0.9999999999622486);
    expect(sigmoidalMembershipFunction(-6, parameters)).toBe(0.9999999997210531);
    expect(sigmoidalMembershipFunction(-5, parameters)).toBe(0.9999999979388463);
    expect(sigmoidalMembershipFunction(-4, parameters)).toBe(0.9999999847700205);
    expect(sigmoidalMembershipFunction(-3, parameters)).toBe(0.9999998874648379);
    expect(sigmoidalMembershipFunction(-2, parameters)).toBe(0.9999991684719722);
    expect(sigmoidalMembershipFunction(-1, parameters)).toBe(0.9999938558253978);
    expect(sigmoidalMembershipFunction(0, parameters)).toBe(0.9999546021312976);
    expect(sigmoidalMembershipFunction(1, parameters)).toBe(0.9996646498695336);
    expect(sigmoidalMembershipFunction(2, parameters)).toBe(0.9975273768433653);
    expect(sigmoidalMembershipFunction(3, parameters)).toBe(0.9820137900379085);
    expect(sigmoidalMembershipFunction(4, parameters)).toBe(0.8807970779778823);
    expect(sigmoidalMembershipFunction(5, parameters)).toBe(0.5);
    expect(sigmoidalMembershipFunction(6, parameters)).toBe(0.11920292202211755);
    expect(sigmoidalMembershipFunction(7, parameters)).toBe(0.01798620996209156);
    expect(sigmoidalMembershipFunction(8, parameters)).toBe(0.0024726231566347743);
    expect(sigmoidalMembershipFunction(9, parameters)).toBe(0.0003353501304664781);
    expect(sigmoidalMembershipFunction(10, parameters)).toBe(0.000045397868702434395);
  });
});
