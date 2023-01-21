# QUESTION ABOUT:: The difference between module.export and export in Node.js

When we want to export a single class/variable/function from one module to another module, we use *module.exports::*

*me_* prefix means:: module export

Create two files *me_calculator.js* and *me_operation.js* and export the Arithmetic class from *me_calculator.js* to *me_operation.js* using *module.exports* method. Here, we have created a class Arithmetic and exported the whole class using *module.exports*.

*me_calculator.js::*

```javascript
class Arithmetic {
	constructor(a, b) {
		this.a = a;
		this.b = b;
	}

	add() {
		return this.a + this.b;
	}
	subtract() {
		return this.a - this.b;
	}

	multiply() {
		return this.a * this.b;
	}

	divide() {
		if (this.b != 0) {
			return this.a / this.b;
		}
		return "divided by zero !!!!";
	}
};

module.exports = Arithmetic;
```

*me_operation.js*

```javascript
const Arithmetic = require('./calculator.js');

const op = new Arithmetic(100,40);

console.log(`Addition -> ${op.add()}`);
console.log(`subtraction -> ${op.subtract()}`);
console.log(`Multiplication -> ${op.multiply()}`);
console.log(`Division -> ${op.divide()}`);
```

Output looks like this::

![Image.png](https://res.craft.do/user/full/3bd38c9a-7a34-eba3-9876-1d5233e52b8d/doc/3643B3A1-72C9-4347-A03D-BF7BDB936D38/DCCE215A-40C2-4EC7-9068-168F679C9B8E_2/MFfoWxSLktmL2gcyUx1fBeTYHSAEkYcbEVNT5rLRZGgz/Image.png)

When we want to export multiple variables/functions from one module to another, we use exports.

*e_* prefix means:: export

Create two files *e_calculator.js* and *e_operation.js* and export multiple functions from e_*calculator.js* file.

*e_calculator.js*

```javascript
exports.add = (a, b) => a + b;
exports.subtract = (a, b) => a - b;
exports.multiply = (a, b) => a * b;
exports.divide = (a, b) => {
	if (b != 0) {
		return a / b;
	}
	return `Divided by zero !!!`;
}
```

*e_operator.js*

```javascript
const Arithmetic = require('./calculator.js');

console.log(`Addition -> ${Arithmetic.add(100,40)}`);
console.log(`subtraction -> ${Arithmetic.subtract(100,40)}`);
console.log(`Multiplication -> ${Arithmetic.multiply(100,40)}`);
console.log(`Division -> ${Arithmetic.divide(100,40)}`);
```

Output looks like this::

![Image.png](https://res.craft.do/user/full/3bd38c9a-7a34-eba3-9876-1d5233e52b8d/doc/3643B3A1-72C9-4347-A03D-BF7BDB936D38/69D9B6A9-DD82-461A-B070-B78F230E4C85_2/SEhgc5FZqyyeoyV9Js4d6kGnLLNFOb0eur11lNH4Qc8z/Image.png)

Source::

[Difference between module.exports and exports in Node.js - GeeksforGeeks](https://www.geeksforgeeks.org/difference-between-module-exports-and-exports-in-node-js/)

