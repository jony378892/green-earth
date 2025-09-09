## 1. What is the difference between var, let, and const?

### Here is some difference between var, let and const

- var was used before the released of ES6 version. After that let and const was introducted.
- var is hoisted with undefined and let, const hoisted without initialization.
- var can be redecleard, but let and const can't be redecleared on the same scope.
- var and let can be reassigned but const can't be reassigned.
- var is function scoped where let and const is block scoped.

## 2. What is the difference between map(), forEach(), and filter()?

### These are some bulit-in function in javascript.Here are some difference between them.

Map(): This method is used to iterate over an array and returned the modified data.

forEach(): This method is used to iterate over an array , but doesn't return anything.

filter(): This method is used to iterate over and array and return a new array based on given condition.

## 3. What are arrow functions in ES6?

### Arrow function is one of the feature introduced in ES6 , which version was released on 2015

Arrow funcion is a shorthand version of the default funcion decleartion. It is easier to use. But it has a flaw, it can't access any object using this keyword. Example -

```javascript
function example() {}

const example = () => {};
```

## 4. How does destructuring assignment work in ES6?

### Destructuring is also one of the feature comes with ES6

Destructuring is used to get individual key value pair from an object without using the dot notation or values from different position from an array without pointing its position. Example-

```javascript
const { key1, key2 } = { key1: value1, key2: value2, key3: value3 };

const [value1, value2] = [value1, vlaue2, value3];
```

## 5. Explain template literals in ES6. How are they different from string concatenation?

### Template liteals:

This is heavily used in javascript for using a value in a string without concatenation. It usees backticks with dollar sign and curly braces eliminating the quotaion. Example -

```javascript
const value = 100;

const price = `The product price is ${value} dollar`;
```
