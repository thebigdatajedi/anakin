const Arithmetic = require('./me_calculator.js');

const op = new Arithmetic(100,40);

console.log(`Addition -> ${op.add()}`);
console.log(`subtraction -> ${op.subtract()}`);
console.log(`Multiplication -> ${op.multiply()}`);
console.log(`Division -> ${op.divide()}`);
