<h1>Fuzz</h1>

Fuzz is a tool to create and manipulate fuzzy sets in JavaScript.

<h2>How to use</h2>

To construct a fuzzy set, use the FuzzySet constructor. The name parameter is mandatory, with an optional array of FuzzyValue to populate the values

```
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

<h2>Creating a set with a membership function</h2>

If you do not specify the values of the set, these can instead by generated by a membership function. Currently supported membership functions are Triangular, Trapezoidal, Gaussian and Sigmoidal. These can be used to generate values like so:

```
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

```
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

![Alt text](images/triangularMf.png 'Triangular membership function (plotted)')

<h3>Trapzoidal</h3>
Generates a trapezoidal shape. All values because `bottomLeft` are zero, `topLeft` to `topRight` is one, and all values after `bottomRight` are zero

```
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

![Alt text](images/trapezoidalMf.png 'Trapezoidal membership function (plotted)')

<h3>Gaussian</h3>
Generate a bell curve centered around `center`, with height `height`, and width based on `standardDeviation`

```
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

![Alt text](images/gaussianMf.png 'Gaussian membership function (plotted)')

<h3>Sigmoidal</h3>
Generate a curve with degree of slope, `slope`, center `half point`

```
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

![Alt text](images/sigmoidalMf.png 'Sigmoidal membership function (plotted)')

<h2>Fuzzy operators</h2>

There are many fuzzy operators that can be applied to the set once it has been created. These can be called as standalone functions, or from the set itself:

```
const f1 = new FuzzySet('Fuzzy set', values);
f1.height();
// or
height(f1);
```

The available operators are:
operation | parameters | description
--------- | ---------- | -----------
alphacut | (set: FuzzySet, alpha: number, strong: boolean = false) | An α-cut of a fuzzy set, A, is a crisp set, Aα, that contains all elements of A, with membership greater than or equal to the specified value of α. A _strong_ α-cut is the same, but only those values that have membership greater than α, instead of those greater or equal.
support | (set: FuzzySet) | The support of a fuzzy set, A, is a strong α-cut of A, where α = 0. Thus, the support of a fuzzy set is all non zero values of that set.
height | (set: FuzzySet) | The height of a fuzzy set is the largest membership grade attained by any element of that set.
isNormal | (set: FuzzySet) | A fuzzy set is said to be normalised if at least one its elements attains the maximum possible membership grade (of 1).
isConvex | (set: FuzzySet) | [NOT YET IMPLEMENTED] - A set is convex if we cannot draw a line from two points on the set that cross the set at any point.
complement | (set: FuzzySet) | The complement,of a fuzzy set is a fuzzy set in which the value of membership for each member is (1 - μ) (where μ is the membership grade in the original set)
union | (setA: FuzzySet, setB: FuzzySet) | The union of two fuzzy sets, A and B, is a new fuzzy set with all values with the maximum membership value
intersection | (setA: FuzzySet, setB: FuzzySet) | The intersection of two fuzzy sets, A and B, is a new fuzzy set with all values with the minimum membership value

<h2>Defuzzification</h2>

Defuzzification is the process of taking a fuzzy set and producing a single crisp value to represent it. Currently four defuzzication methods are implemented: centroid (center of gravity), mean of maxima, smallest of maxima, and largest of maxima.

```
const f1 = new FuzzySet('Fuzzy set', values);
f1.defuzzify('Centroid')
=> 10 // some single crisp value
```