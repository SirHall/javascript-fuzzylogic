<h1>javascript-fuzzylogic</h1>

javascript-fuzzylogic is a tool to utilise fuzzy logic in JavaScript. Code is hosted [here](https://gitlab.com/nargarawr/fuzz).

<h2>What is fuzzy logic?</h2>
Fuzzy logic is a “natural” way of expressing uncertain or qualitative information. It is a form of logic that deals with approximate reasoning, as opposed to fixed, exact values, like those found in classical logic (where we may only have properties being true, or false).
Instead of these strict truth values, fuzzy logic systems have a range of truth, between 0 and 1. 

In a classical set, the membership, μA(x) of x, of a set, A, in universe, X, is defined:
```
μA(x) = (
    1, iff x ∈ A
    0, iff x ∈/ A
)
```

That is, the element is either in the set, or not. In a fuzzy set, however, we have grades of membership, which are real numbers in the interval, μA(x) ∈ [0, 1]. Every member of a set has a membership grade to that set, depicting how true the property represented by that set is, for the given member. As an example, in the image below we have three sets (cold, warm, and hot) that represent the temperature of some thing. Instead of using one of those words to describe a particular value of x, such as "if x is 35 then it's warm", we can be a lot more specific. In this case, μ(35) is 0.25 cold, 0.75 warm, and 0 hot - which is a lot more specific.

![Alt text](https://i.ibb.co/zssZ7LC/sets-Example.png 'Fuzzy set example')


<h2>What are the main features of this package?</h2>
There are two main ways to use this package: either by creating a full fuzzy inference system, and then running that with some parameters to arrive at a single crisp value for your problem; or, more simply, to just create fuzzy sets and manipulate them with the built in fuzzy operators.

<h2>Constructing a fuzzy inference system</h2>
A fuzzy inference system can be broken down into three main parts: Input Variables, Output Variables, and Rules. The input variables are a collection of fuzzy sets that govern how the inputs to your system should be handled, and the output variables are the same, but for the output value. The rules of the system govern how these inputs and outputs are tied together.

Let's build an example set to demonstrate:

```javascript
// We start by creating our fuzzy sets (or membership functions) that will make up our variables
// How to construct fuzzy sets is dealt with below
const serviceGood = new FuzzySet('good', { initParams })
const serviceBad = new FuzzySet('bad', { initParams })

const foodTasty = new FuzzySet('tasty', { initParams })
const foodGross = new FuzzySet('gross', { initParams })

const cheapTip = new FuzzySet('cheap', { initParams })
const generousTip = new FuzzySet('generous', { initParams })

// Then, we tie these fuzzy sets to variables
const serviceVariable = new LinguisticVariable('service')
  .addSet(serviceGood)
  .addSet(serviceBad)

const foodVariable = new LinguisticVariable('food')
  .addSet(foodTasty)
  .addSet(foodGross)

const tipVariable = new LinguisticVariable('tip')
  .addSet(cheapTip)
  .addSet(generousTip)

// Now that we have variables with sets, we attach them to a fuzzy inference system
const exampleFIS = new FuzzyInferenceSystem('Example')
    .addInput(serviceVariable)
    .addInput(foodVariable)
    .addOutput(tipVariable);

// Finally we add rules to our system, written in natural language
// The values must match our variables and their fuzzy sets
exampleFIS.addRule('IF service IS good AND food IS tasty THEN tip IS generous')
exampleFIS.addRule('IF service IS bad OR food IS gross THEN tip IS cheap')
```

Now we have a FIS, what can we actually do with is? We can run the solve function, which will take values for each of our inputs ('food' and 'service') in this case, and return us a single value for how much we should tip!

```
exampleFIS.solve('mamdani', {service: 10, food: 10}, DefuzzifcationType.Centroid)
=> 30
```

In the above example, we scored the service 10/10 and the food 10/10, so the tip given to us was 30% (of a possible 30), which makes sense, as the service and food were both excellent. The defuzzification type is discussed more below. Mamdani is the only inference type available currently.

<h2>Constructing a fuzzy set </h2>

To construct a fuzzy set, use the FuzzySet constructor. The name parameter is mandatory, with an optional array of FuzzyValue to populate the values

```javascript
const f1 = new FuzzySet('Empty set example');
// or
const values: FuzzyValue[] = [
    {
        membership: 1,
        value: 0
    },
    {
        membership: 0,
        value: 10
    }
]
const f2 = new FuzzySet('Set with values', values);
```

We can run operators on these fuzzy sets like so:

```javascript
const f1 = new FuzzySet('Fuzzy set', values);
f1.height();
// or
height(f1);
```

The available operators are details in the API section below.

<h2>Creating a set with a membership function</h2>

If you do not specify the values of the set, these can instead by generated by a membership function. Currently supported membership functions are Triangular, Trapezoidal, Gaussian and Sigmoidal. These can be used to generate values like so:

```javascript
const f1 = new FuzzySet('Empty set example');

f1.generateMembershipValues({
    type: 'Triangular',
    parameters: {
        left: 20,
        center: 60,
        right: 80,
        minValue: 0,
        maxValue: 100,
        step: 10,
    }
})

console.log(f1.values)
=> [
        {value: 0, membership: 0},
        {value: 10, membership: 0},
        {value: 20, membership: 0},
        {value: 30, membership: 0.25},
        {value: 40, membership: 0.5},
        {value: 50, membership: 0.75},
        {value: 60, membership: 1},
        {value: 70, membership: 0.5},
        {value: 80, membership: 0},
        {value: 90, membership: 0},
        {value: 100, membership: 0}
    ]
```

<h3>Triangular</h3>
Generates a triangular shape. All values before `left` are zero, `center` is one, and all values after `right` are zero.

```javascript
// Formula: Math.max(Math.min((xValue - left) / (center - left), (right - xValue) / (right - center)), 0)
const f1 = new FuzzySet('Empty set example');
f1.generateMembershipValues({
    type: 'Triangular',
    parameters: {
        left: 20,
        center: 60,
        right: 80,
        minValue: 0,
        maxValue: 100,
        step: 10,
    }
})
```

The above code would create a fuzzy set that would look like:

![Alt text](https://i.ibb.co/mJV98ZM/triangular-Mf.png 'Triangular membership function (plotted)')

<h3>Trapzoidal</h3>
Generates a trapezoidal shape. All values because `bottomLeft` are zero, `topLeft` to `topRight` is one, and all values after `bottomRight` are zero.

```javascript
// Formula: Math.max(Math.min((xValue - bottomLeft) / (topLeft - bottomLeft), 1, (bottomRight - xValue) / (bottomRight - topRight)), 0);
const f1 = new FuzzySet('Empty set example');
f1.generateMembershipValues({
    type: 'Trapezoidal',
    parameters: {
        bottomLeft: 10,
        topLeft: 20,
        topRight: 60,
        bottomRight: 95,
        minValue: 0,
        maxValue: 100,
        step: 10,
    }
})
```

![Alt text](https://i.ibb.co/XtW7LCs/trapezoidal-Mf.png 'Trapezoidal membership function (plotted)')

<h3>Gaussian</h3>
Generate a bell curve centered around `center` and width based on `standardDeviation`.

```javascript
// Formula: Math.exp(-0.5 * Math.pow((xValue - center) / standardDeviation, 2))
const f1 = new FuzzySet('Empty set example');
f1.generateMembershipValues({
    type: 'Gaussian',
    parameters: {
        center: 50,
        standardDeviation: 20,
        minValue: 0,
        maxValue: 100,
        step: 10,
    }
})
```

![Alt text](https://i.ibb.co/NTGVMg1/gaussian-Mf.png 'Gaussian membership function (plotted)')

<h3>Sigmoidal</h3>
Generate a curve with degree of slope, `slope`, center `half point`.

```javascript
// Formula: 1 / (1 + Math.exp(-slope * (xValue - center)))
const f1 = new FuzzySet('Empty set example');
f1.generateMembershipValues({
    type: 'Sigmoidal',
    parameters: {
        slope: -2,
        center: 5,
        minValue: 0,
        maxValue: 100,
        step: 10,
    }
})
```

![Alt text](https://i.ibb.co/NpFvnPy/sigmoidal-Mf.png 'Sigmoidal membership function (plotted)')

<h2>Defuzzification</h2>

Defuzzification is the process of taking a fuzzy set and producing a single crisp value to represent it. Currently four defuzzication methods are implemented: centroid (center of gravity), mean of maxima, smallest of maxima, and largest of maxima. Defuzzification is used at the end of processing a fuzzy inference system to provide a single result that can represent all the values of that system, after the inputs and rules have been processed.

```javascript
const f1 = new FuzzySet('Fuzzy set', values);
f1.defuzzify('Centroid')
=> 10 // some single crisp value
```

<h3>Centroid</h3>
Finds the 'center of gravity' for a given fuzzy set (i.e, the center of mass).

![Alt text](https://i.ibb.co/D7ZJLYw/centroid-Defuzz.png 'Centroid defuzzication example and formula')

<h3>Mean of Maxima</h3>
The average value of all values with the highest membership

![Alt text](https://i.ibb.co/1K6dW7L/mom-Defuzz.png 'Mean of maxima defuzzication example and formula')

<h3>Largest/Smallest of Maxima</h3>
The largest/smallest value of all values with the highest membership

![Alt text](https://i.ibb.co/W595Y5h/lom-And-Som-Defuzz.png 'Largest/Smallest of Maxima defuzzication example and formula')

<h2>API</h2>

<h3>FuzzyInferenceSystem</h3>

| function    | args                                                                                    | description                                                         |
| ----------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| constructor | (name: string, inputs?: LinguisticVariable[], outputs?: LinguisticVariable[])           | Create the FIS. Inputs and outputs are optional                     |
| addInput    | (variable: LinguisticVariable)                                                          | Adds the input to the system, returns this for chaining             |
| addOutput   | (variable: LinguisticVariable)                                                          | Adds the output to the system, returns this for chaining            |
| addRule     | (rule: string)                                                                          | Adds natural language rule to the system, returns this for chaining |
| solve       | (type: 'Mamdani', args: Record<string, number>, defuzzicationMethod: DefuzzicationType) | Runs inference on the fuzzy system to produce a single value result |

<h3>LinguisticVariable</h3>

| function    | args                                   | description                             |
| ----------- | -------------------------------------- | --------------------------------------- |
| constructor | (name: string, fuzzySets?: FuzzySet[]) | Creates the variable, sets are optional |
| addSet      | (set: FuzzySet)                        | Adds a set to the variable              |
| getSet      | (name: string)                         | Gets the given set, by name             |

<h3>LingsticRule</h3>

| function    | args                                                                                  | description                                                                                                                                                                                                                                                                                                              |
| ----------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| constructor | (operator: LinguisticRuleOperator, antecedents: Antecedent[], consequent: Consequent) | Creates the rule, LinguisticRuleOperator is the AND/OR parameter. Antecedents are the inputs (everything that would come before a 'THEN') and the consequent is the output (everything after the 'then'). It's much each to create a rule from a FIS with .addRule(), and then use natural language to specify the rule. |
| prettyPrint | N/A                                                                                   | Returns a string of the rule, written in natural language                                                                                                                                                                                                                                                                |

<h3>FuzzySet</h3>

| operation          | parameters                                              | description                                                                                                                                                                                                                                                                     |
| ------------------ | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | 
| constructor        | (name: string, initialValues?: FuzzyValue[])            | Create a set, initial values are optional and can be generated with a membership function                                                                                                                                                                                       |
| alphacut           | (set: FuzzySet, alpha: number, strong: boolean = false) | An α-cut of a fuzzy set, A, is a crisp set, Aα, that contains all elements of A, with membership greater than or equal to the specified value of α. A _strong_ α-cut is the same, but only those values that have membership greater than α, instead of those greater or equal. |
| support            | (set: FuzzySet)                                         | The support of a fuzzy set, A, is a strong α-cut of A, where α = 0. Thus, the support of a fuzzy set is all non zero values of that set.                                                                                                                                        |
| height             | (set: FuzzySet)                                         | The height of a fuzzy set is the largest membership grade attained by any element of that set.                                                                                                                                                                                  |
| isNormal           | (set: FuzzySet)                                         | A fuzzy set is said to be normalised if at least one its elements attains the maximum possible membership grade (of 1).                                                                                                                                                         |
| isConvex           | (set: FuzzySet)                                         | [NOT YET IMPLEMENTED] - A set is convex if we cannot draw a line from two points on the set that cross the set at any point.                                                                                                                                                    |
| complement         | (set: FuzzySet)                                         | The complement,of a fuzzy set is a fuzzy set in which the value of membership for each member is (1 - μ) (where μ is the membership grade in the original set)                                                                                                                  |
| union              | (setA: FuzzySet, setB: FuzzySet)                        | The union of two fuzzy sets, A and B, is a new fuzzy set with all values with the maximum membership value                                                                                                                                                                      |
| intersection       | (setA: FuzzySet, setB: FuzzySet)                        | The intersection of two fuzzy sets, A and B, is a new fuzzy set with all values with the minimum membership value                                                                                                                                                               | generateMembershipValues | (mf: MembershipFunction<T>) | Given a membership function, of type T, generate all the values of that membership function and store them in the fuzzy set |
| defuzzify          | (type: DefuzzicationType)                               | Return a single crisp value for this set, based on the defuzzication method provided                                                                                                                                                                                            |
| getPlottableValues | N/A                                                     | Returns an object { xValues: number[]; membershipValues: number[] } that contains all the xValues and membership values (yValues) for easier plotting                                                                                                                           |
| getMembership      | (xValue: number)                                        | For the given xValue, determine it's degree of membership to the set                                                                                                                                                                                                            |
