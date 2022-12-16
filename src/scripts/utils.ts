

function restorePrototype(obj: any): any {
	if (typeof obj == "object") {
		if (obj.extension) obj.__proto__ = extensions[obj.extension].prototype;
		for (let prop in obj) {
			let val = obj[prop];
			restorePrototype(val);
		}
	}
}

function disableForm(form: HTMLFormElement) {
	Array.prototype.forEach.call(form.elements, e => {
		e.disabled = e.readOnly = true;
		if (e.__proto__ === `HTMLButtonElementPrototype` || e.type === "submit") e.style.cursor = `wait`;
	});
}

function enableForm(form: HTMLFormElement) {
	Array.prototype.forEach.call(form.elements, e => {
		e.disabled = e.readOnly = false;
		if (e.__proto__ === `HTMLButtonElementPrototype` || e.type === "submit") e.style.cursor = `default`;
	});
}


const factorsCache: { [n: number]: number[], get length(): number } = {
	get length() {
		return Object.keys(this).length;
	}
};
function factors(x: number): number[] { //returns all the positive integer factors of x, including x
	x = Math.abs(x);
	if (x in factorsCache) return factorsCache[x]; //if x has already been solved before, then return the value
	var answer = [x],
		increment = (x % 2 == 0 ? 1 : 2),
		base = ((x % 2 == 0 ? 2 : 3)); //if x is an odd number, then check only the odd numbers. Otherwise check both odd & even no.s
	for (var i = base; i <= Math.floor(Math.sqrt(x)); i += increment) {
		if (x % i == 0) {
			;
			var right = factors(x / i),
				left = factors(i); //when a factor of x is found, find it's complement, evaluate both their factors & combine them..
			answer = [...answer, ...right, ...left]; //to get the complete factors. (This is because the factors of a number is the product of the..
			for (var m = 0, n = right[m]; m < right.length; ++m, n = right[m]) { //combination of the factors of any of it's complementary factors.
				for (var p = 0, q = left[p]; p < left.length; ++p, q = left[p]) {
					if (n * q !== x) answer.push(n * q);
				}
			};
			if (Set) { //remove all duplicate values in answer
				answer = [...(new Set(answer))];
			} else {
				answer = answer.reduce(function (list: number[], n) {
					if (list.every(function (s) {
						return s !== n
					})) {
						list.push(n);
					};
					return list;
				}, []);
			}
			answer = answer.sort(function (a, b) {
				return a - b
			});
			factorsCache[x] = answer;
			return answer;
		}
	}
	factorsCache[x] = answer;
	return [x]
}

function isSquare(x: number) { //Returns a boolean indicating whether or not x is a perfect square
	const sqr = Math.sqrt(x);
	return sqr == Math.floor(sqr) ? true : false
};

function makeWhole(...numbers: number[]): { numbers: number[], decimalDigits: number } { //returns all of numbers as whole by multiplying through by 10^ highest number of decimal digits
	const formattedNumbers: string[] = numbers.map(n => ~String(n).indexOf("e") ? n.toFixed(15).replace(/0+$/, ``) : n.toString()); //collect all arguments in string form
	//determine the highest number of decimal digits in numbers
	let highestDecimalDigits = formattedNumbers.every(Number.isInteger) ? 0 : formattedNumbers.reduce((h, n) => Math.max(h, (~n.indexOf(".")) ? (n.length - 1) - n.indexOf(".") : 0), 0);
	return { decimalDigits: highestDecimalDigits, numbers: formattedNumbers.map(n => Math.round(Number(n) * Math.pow(10, highestDecimalDigits))) } //multiply all of the numbers by 10^ the highest decimal digits count
};

function sqRoot(n: number /*number*/) { //Returns the square root of n. returns a surd or a complex number where applicable
	var nP = Math.abs(n); //set nP to the positive value of n
	let result: string | number = "\u221A" + n; //set result to root n, if n isn't a perfect square and neither is any of it's factors.
	if (isSquare(nP)) {
		result = (n >= 0) ? Math.sqrt(nP) : Math.sqrt(nP) + "\u221A" + -1; //if nP is a perfect square, set result to root n if n was positive else, set to root n * root -1
	} else {
		for (var nP_fcList = factors(nP), i = nP_fcList.length - 1, j = nP_fcList[i]; i > -1; --i, j = nP_fcList[i]) { //Take the highest perfect square factor of xP if any,..
			if (isSquare(j)) {
				result = Math.sqrt(j) + "\u221A" + n / j;
				break; //..factor it out and multiply it's root by what is left under the square root sign.
			}
		}
	};
	return result
}

function lowestRatios(...numbers: number[]) { //returns the lowest integer ratios of all the numbers
	var answer = makeWhole(...numbers),
		lowest = Math.min(...answer.numbers),
		fctList = factors(lowest); //select the lowest number in the arguments and find its factors
	for (var i = fctList.length - 1, j = fctList[i]; i >= 0; --i, j = fctList[i]) {
		if (answer.numbers.every(isFactorOf.bind(null, j))) { //if all other arguments are divisible by any of the factors, highest to lowest,..
			return answer.numbers.map(divide.bind(null, j)); //then divide them through by the factor and return
		}
	}
	return answer.numbers; //if none of the factors could divide through, then return the original arguments
}


function isFactorOf(x: number, n: number) {
	return n % x == 0;
}

function divide(x: number, n: number) {
	return n / x;
}


function combination(n: number, m: number) {
	return factorial(n) / (factorial(n - m) * factorial(m));
}

function factorial(n: number) {
	let count = n,
		ans = 1;
	while (count > 0) {
		ans *= count;
		--count;
	}
	return ans;
}

//class definitions
/*
 * instances "extension" property are used to restore their prototype when they are transferred to/from workers.
 */
class Fraction {
	extension = "Fraction";
	nume: number | string;
	denom: number | string
	constructor(nume: number | string, denom: number | string) {
		if (arguments.length == 2) {
			//if one argument is supplied, then represent it as a fraction, otherwise, make a fraction from two arguments supplied.
			this.nume = nume;
			this.denom = denom;
		} else {
			if (typeof nume == "number") {
				let whole = makeWhole(nume);
				this.nume = whole.numbers[0];
				this.denom = Math.pow(10, whole.decimalDigits);
			} else {
				this.nume = nume;
				this.denom = 1;
			}
		}
	}

	toLowestTerms() { //returns the fraction in it's lowest terms.
		let t, d, top, bottom, reducedRatios, n = String(this.nume),
			denom = String(this.denom);
		if (!isNaN(t = parseFloat(n)) && !isNaN(d = parseFloat(denom))) {
			reducedRatios = lowestRatios(t, d);
			top = reducedRatios[0];
			bottom = reducedRatios[1]
			if (bottom < 0) bottom = -bottom, top = -top; //make the denominator positive
			n = n.replace(t.toString(), top.toString()); //replace the coefficients
			denom = denom.replace(d.toString(), bottom.toString());
		} else {
			if (denom[0] == "-") denom = denom.replace(/^-/, ""), n = n[0] == "-" ? n.replace(/^-/, "") : "-" + n;
		}
		return new Fraction(n, denom);
	}
	valueOf() {
		return Number(this.nume) / Number(this.denom)
	}
}




class Term {
	extension = "Term";
	coefficient: number = 1;
	variables: Exponential[];
	constructor(...args: Exponential[]) {
		for (let index = 0; index < args.length; index++) {
			if (!isNaN(Number(args[index]))) {
				this.coefficient *= Number(args[index]);
				args.splice(index--, 1);
			}
		}
		this.variables = args.reduce((product: Exponential[], arg) => {
			for (let i = 0, processedArg: Exponential; i < product.length; i++) {
				processedArg = product[i];
				if (processedArg.compareBase(arg) == 0) {   //if the variable has equivalent base as arg, add arg's power to it
					product[i] = new Exponential(processedArg.base, add(product[i].power, arg.power));
					return product;
				} else if (typeof (arg.base) == "string" && typeof (processedArg.base) == "string")
					for (let processedvariable of processedArg.base) {
						for (let argvariable of arg.base as string) {
							if (argvariable == processedvariable) {                               //if a single letter of arg is in productvariable
								let toAdd;
								toAdd = new Exponential(processedvariable, add(processedArg.power, arg.power));
								processedArg = product[i] = new Exponential((processedArg.base as string).replace(processedvariable, ""), processedArg.power);
								if (!(product[i].base)) product.splice(i--, 1);
								arg = new Exponential((arg.base as string).replace(processedvariable, ""), arg.power);
								if (product.length) {
									for (let already in product) {
										if (product[already].comparePower(toAdd) == 0) {
											if (isString(toAdd.base) && isString(product[already].base)) product[already] = new Exponential((product[already].base as string) + toAdd.base, product[already].power);
						else product[already] = new Exponential(multiply(product[already].base, toAdd.base), product[already].power);
											break;
										} else if (Number(already) == product.length - 1) {
											product.push(toAdd);
										}
									}
								} else {
									product.push(toAdd);
								}
								if (Number(arg) == 0) return product; //arg's base may have been exhausted
							}
						}
					}
				if (product[i]) {
					if (product[i].comparePower(arg) == 0) {
						if (isString(arg.base) && isString(product[i].base)) product[i] = new Exponential((product[i].base as string) + arg.base, product[i].power);
						else product[i] = new Exponential(multiply(product[i].base, arg.base), product[i].power);
						return product;
					}
				}
			}
			if (arg.base) product.push(arg);

			return product;
		}, []);
		this.variables.sort((a, b) => {
			if (isString(a.base)) {
				if (isString(b.base)) return (a.base as string).localeCompare(b.base as string);        //arrange variables in aphabetical order
				else return -1;      //complex term should come last
			} else {
				if (isString(b.base)) return 1;
				return 0;
			}
		})
	}
	valueOf() {
		if (this.coefficient == 0) return 0;
		return this.variables.reduce((a, b) => Number(a) * Number(b), this.coefficient)
	}

	isAddable(other: Term) {
		if (this.variables.length != other.variables.length) return false;
		outerLoop: for (let thisVariable of this.variables) {
			for (let otherVariable of other.variables) {
				if (thisVariable.comparePower(otherVariable) != 0) continue;  //variables do not match
				if (thisVariable.compareBase(otherVariable) == 0) continue outerLoop; //both base and power match
			}
			return false;
		}
		return true;
	}
	flatten() {
		const flattenedVariables = this.variables.map(variable => variable.flatten());
		return flattenedVariables.reduce(
			(cumulativeProduct, pol) => multiply(cumulativeProduct, pol),
			new Polynomial(this.coefficient));
	}

}


function isString(str: any) { return typeof (str) == "string" || str instanceof String; }

class Tree<T> {
	cargo: T;
	left: Tree<T> | null;
	right: Tree<T> | null;

	constructor(cargo: T, left: Tree<T> | null = null, right: Tree<T> | null = null) {
		[this.cargo, this.left, this.right] = [cargo, left, right]
	}
	toString() {
		function _toFormat(tree: Tree<T>, width: number, height: number, offset: number) {
			offset += width;
			let str = "";
			if (tree.isLeaf) return str + " ".repeat(offset) + String(tree.cargo) + "\n".repeat(height);
			else if (!(tree.left && tree.right)) throw new Error("not a tree");
			str += _toFormat(tree.left, width, height, offset);
			str += " ".repeat(offset) + String(tree.cargo) + "\n".repeat(height);
			str += _toFormat(tree.right, width, height, offset);
			return str;
		}
		return _toFormat(this, 8, 1, -8)
	}

	get isLeaf() {
		return this.left == null && this.right == null ? true : false;
	}
	replaceNode(node: Tree<T>, newNode: Tree<T>) {
		let currentTreeNode: Tree<T> = this;
		while (currentTreeNode.right) {
			if (currentTreeNode.right == node) {
				currentTreeNode.right = newNode;
				return
			}
			currentTreeNode = currentTreeNode.right;
		}
	}

	getRightMost() {
		let rightMost: Tree<T> = this;
		while (rightMost.right instanceof Tree) rightMost = rightMost.right;
		return rightMost;
	}

	extend(value: T) {
		let previousValue = this.cargo;
		this.cargo = value;
		this.left = new Tree(previousValue, this.left, this.right);
		this.right = null;
	}

	print(indent: number) {
		console.log('  '.repeat(indent) + (this.cargo as Object).toString());
		if (this.left) this.left.print(indent + 5);
		if (this.right) this.right.print(indent + 5);
	}


}


class Polynomial {
	terms: Term[] = [];
	variableLetters: Set<string> = new Set;
	extension: string = "Polynomial";

	constructor(terms: Term[] | Term | number | string = []) {
		if (typeof terms == "number" || typeof terms == "string") terms = [new Term(new Exponential(terms))];
		else if (terms instanceof Term) terms = [terms];
		processTerms: for (let term of terms) {
			if (Number(term) == 0) continue;
			for (let variable of term.variables) {
				if (variable.base instanceof Polynomial) variable.base.variableLetters.forEach(letter => this.variableLetters.add(letter));
				else if (typeof variable.base == "string") this.variableLetters = new Set([...this.variableLetters, ...variable.base.split("")]);
				if (variable.power instanceof Polynomial) variable.power.variableLetters.forEach(letter => this.variableLetters.add(letter));
				else if (typeof variable.power == "string") this.variableLetters = new Set([...this.variableLetters, ...variable.power.split("")]);
			}
			for (let index = 0, processedTerm: Term; index < this.terms.length; index++) {
				processedTerm = this.terms[index];
				if (processedTerm.isAddable(term)) {
					processedTerm.coefficient += term.coefficient;
					if (processedTerm.coefficient == 0) {
						this.terms.splice(index--, 1);    //in case adding produced 0
					}
					continue processTerms;
				}
			}
			this.terms.push(term);
		}
	}

	valueOf() {
		return this.terms.reduce((sum, term) => sum + Number(term), 0)
	}

	localeCompare(other: Polynomial | number | string) {
		if (typeof other == "string") other = new Polynomial(other);
		else if (typeof other == "number") other = new Polynomial(other);
		if (this.terms.length != other.terms.length) return NaN;
		const [thisTerms, otherTerms] = [this.flatten().terms, other.flatten().terms]
		outerLoop: for (const thisTerm of thisTerms) {
			for (let index = 0; index < otherTerms.length; index++) {
				const otherTerm = otherTerms[index];
				if (thisTerm.coefficient == otherTerm.coefficient && thisTerm.isAddable(otherTerm)) {
					otherTerms.splice(index--, 1);
					continue outerLoop;
				}
			}
			return NaN;
		}
		if (otherTerms.length) return NaN;
		return 0;

	}

	add(term: Term) {
		if (Number(term) != 0) {
			for (let variable of term.variables) {
				if (variable.base instanceof Polynomial) variable.base.variableLetters.forEach(letter => this.variableLetters.add(letter));
				else this.variableLetters = new Set([...this.variableLetters, ...(typeof variable.base == "string" ? variable.base.split("") : "")]);
				if (variable.power instanceof Polynomial) variable.power.variableLetters.forEach(letter => this.variableLetters.add(letter));
				else this.variableLetters = new Set([...this.variableLetters, ...(typeof variable.power == "string" ? variable.power.split("") : "")]);

			}
			for (let index = 0, processedTerm; index < this.terms.length; index++) {
				processedTerm = this.terms[index];
				if (processedTerm.isAddable(term)) {
					const coefficient = processedTerm.coefficient += term.coefficient;
					if (coefficient == 0) {
						this.terms.splice(index--, 1);    //in case adding produced 0
					}

					return this;
				}
			}
			this.terms.push(term);
		}
		return this;
	}
	flatten() {
		if (this.terms.length == 0) return this;
		const allTerms = [...this.terms.map(term => term.flatten().terms).reduce((termsa, termsb) => termsa.concat(termsb))]
		return new Polynomial(allTerms);
	}

	get multivariable() {
		return this.variableLetters.size > 1;
	}
	get degree() {
		let degree = 0;
		for (const term of this.terms) {
			for (const variable of term.variables) {
				degree = Math.max(degree, Number(variable.power));
			}
		}
		return degree;
	}
	get length() {
		return this.terms.length
	}
}

class Exponential {
	power: Polynomial | string | number;
	base: Polynomial | string | number;
	extension: string = "Exponential";
	constructor(base: Polynomial | string | number);
	constructor(base: Polynomial | string | number, power: Polynomial | string | number);
	constructor(base: Polynomial | string | number, power: Polynomial | string | number = 1) {
		if (typeof base == "number" || !isNaN(Number(base))) this.base = Number(base); //if it can be converted to a number, then do so
		else if (typeof (base) == "string" || base instanceof String) this.base = base.split("").sort().join("");  //if it is a string, then sort it
		else {
			// if (base.terms.length == 1) { //if it has just one term, raise the power of the variables in the term
			// 	let product = new Polynomial();
			// 	let variables: Exponential[] = [];
			// 	for (let variable of base.terms[0].variables) {
			// 		variables.push(new Exponential(variable.base, multiply(variable.power, power))
			// 		);
			// 	}
			// 	if (!isNaN(Number(power))) variables.push(new Exponential(base.terms[0].coefficient ** Number(power)));
			// 	else variables.push(new Exponential(base.terms[0].coefficient, power));
			// 	product.add(new Term(...variables));
			// 	this.base = product;
			// 	power = 1;
			// } else 
			this.base = base; //otherwise, leave as is. Will require expansion 
		}
		if (!isNaN(Number(power))) this.power = Number(power);
		else if (typeof power == "string" || power instanceof String) this.power = power.split("").sort().join("");
		else this.power = power;
	}
	valueOf() {
		if (Number(this.base) == 1) return 1;
		if (Number(this.base) == 0) return 0;
		return Math.pow(Number(this.base), Number(this.power.valueOf()));
	}
	comparePower(other: Exponential) {
		return this.compareComponents(this.power, other.power);
	}
	compareComponents(a: Polynomial | string | number, b: Polynomial | string | number) {
		if (a.valueOf() == b.valueOf()) return 0;
		if (typeof a == "string" || a instanceof String) {
			if ((typeof b == "string" || b instanceof String) && a.localeCompare(b as string) == 0) return 0;
			if (b instanceof Polynomial && new Polynomial(new Term(new Exponential(a))).localeCompare(b) == 0) return 0;
		} else if (a instanceof Polynomial) {
			if (b instanceof Polynomial && a.localeCompare(b) == 0) return 0;
			if ((typeof b == "string" || b instanceof String) && new Polynomial(new Term(new Exponential(b))).localeCompare(a) == 0) return 0;
		}
		return NaN
	}
	compareBase(other: Exponential): number {
		return this.compareComponents(this.base, other.base);
	}
	flatten(): Polynomial {
		if (!isNaN(Number(this))) return new Polynomial(Number(this));  //if they are both number
		if (!isNaN(Number(this.power)) && Number(this.power) >= 0) {
			if (this.base instanceof Polynomial) {
				const flattenedBase = this.base.flatten();
				let power: number = Number(this.power);
				let cumulativeProduct = flattenedBase;
				while (power > 1) {
					const newCumulative = new Polynomial();
					for (const terma of flattenedBase.terms) {
						for (const termb of cumulativeProduct.terms) {
							multiply(new Polynomial(terma), new Polynomial(termb)).terms.forEach(term => newCumulative.add(term));
						}
					}
					cumulativeProduct = newCumulative;
					power--;
				}
				return cumulativeProduct;
			}

		}
		let simplifiedBase = this.base;
		let simplifiedPower = this.power;
		if (simplifiedBase instanceof Polynomial) {
			let flattenedBase: string | Polynomial | number = simplifiedBase.flatten();
			if (flattenedBase.terms.length == 1 && flattenedBase.terms[0].coefficient == 1 && flattenedBase.terms[0].variables.length == 1 && flattenedBase.terms[0].variables[0].power == 1) flattenedBase = flattenedBase.terms[0].variables[0].base;
			simplifiedBase = flattenedBase;
		}
		if (simplifiedPower instanceof Polynomial) {
			let flattenedPower: string | Polynomial | number = simplifiedPower.flatten();
			if (flattenedPower.terms.length == 1 && flattenedPower.terms[0].coefficient == 1 && flattenedPower.terms[0].variables.length == 1 && flattenedPower.terms[0].variables[0].power == 1) flattenedPower = flattenedPower.terms[0].variables[0].base;
			simplifiedPower = flattenedPower;
		}
		return new Polynomial(new Term(new Exponential(simplifiedBase, simplifiedPower)));
	}
}

function tokenize(expr: string) {
	expr = expr.replace(/[\s\n\t]+/g, "")
	let result;
	let tokens: string[] = [];
	let lastIndex = 0;
	let numberMatcher = /(\d*\.\d+)|\d+/g;
	while (result = numberMatcher.exec(expr)) {
		tokens = tokens.concat(expr.slice(lastIndex, result.index).split(""));
		tokens.push(result[0]);
		lastIndex = numberMatcher.lastIndex;
	}
	tokens = tokens.concat(expr.slice(lastIndex, expr.length).split(""));;
	tokens.push("end");
	return tokens
}
function getToken(token: RegExp, tokens: string[]) {
	if (token.test(tokens[0])) {
		return tokens.shift();
	}
	return null
}

function peekToken(token: RegExp, tokens: string[]) {
	return token.test(tokens[0])
}

function getSingleTerm(tokens: string[]) {
	let coefficient = 1;
	let value: string | number | null = null;
	let variable, number, sign;
	while (sign = getToken(/^[-+]$/, tokens)) {
		coefficient *= Number(sign[0] + 1);
	}
	if (coefficient == -1 && peekToken(/^\(/, tokens)) value = "1"; //a minus sign being before an opening paranthesis implies multiplication by -1
	else if (variable = getToken(/^[a-zA-Z]/, tokens)) value = variable;
	else if (number = getToken(/^(\d*\.\d+)|\d+/, tokens)) value = Number(0 + number);
	if (coefficient == 1 && value != null) value = "+" + value;
	else if (value != null) value = "-" + value;
	return value
}
function getOperator(tokens: string[]) {
	let token = getToken(/^[\+\-\*\/\^]/, tokens);
	if (token) return token;
	if (peekToken(/^[a-zA-Z]/, tokens)) return "*"; //a digit/variable being before a variable implies multiplication
	if (peekToken(/^\(/, tokens)) return "*"; //a digit/variable being before an opening paranthesis implies multiplication
	return null;
}

function getLParans(tokens: string[]) {
	let token = getToken(/^\(/, tokens);
	if (token) return token;
	return null;
}

function getRParans(tokens: string[]) {
	let token = getToken(/\)/, tokens);
	if (token) return token;
	return null;
}

function getRank(operator: string) {
	if (/^[\^]$/.test(operator)) return 1;
	if (/^[\/\*]$/.test(operator)) return 2;
	if (/^[\+\-]$/.test(operator)) return 3;

}

function getAllTerms(tokens: string[]): Tree<string | number> {
	let rootNode: Tree<string | number> | null = null;
	let currentNode: Tree<string | number> | null = null;
	let rightmostNode: Tree<string | number> | null = null;
	let parenthesisIndices: ({ main: Tree<string | number>, rightmostNode: Tree<string | number> } | null)[] = [];
	let last: "operator" | "term" = "operator";
	let term: Tree<string | number>;
	let operator: string;

	while (!getToken(/^end$/, tokens)) {
		if (getRParans(tokens)) {
			if (!parenthesisIndices.length) throw new SyntaxError(`Unexpected closing bracket: No matching opening bracket was found`);
			if (last == "operator") throw new SyntaxError(`Unexpected closing bracket: value or expression expected`);
			const topNode = parenthesisIndices.pop();
			rightmostNode = currentNode;
			if (topNode != null) {
				topNode.rightmostNode.right = rightmostNode;
				currentNode = topNode.main;
			}
			continue;
		}
		switch (last) {
			case "operator":     //Assume the rightmost leaf is null
				const term = getSingleTerm(tokens);
				if (term) {
					last = "term";
					if (rootNode == null) rootNode = currentNode = rightmostNode = new Tree(term);
					else if (rightmostNode == null) currentNode = rightmostNode = new Tree(term);
					else rightmostNode = rightmostNode.right = new Tree(term);
					continue
				}
				if (getLParans(tokens)) {
					parenthesisIndices.push(currentNode && rightmostNode ? { main: currentNode, rightmostNode } : null);
					currentNode = rightmostNode = null;
					continue
				}
				if (peekToken(/end/, tokens)) {
					last = "operator";	//might have removed some + or -
					continue;
				}
				throw new SyntaxError(`unexpected token '${tokens.shift()}': value or expression expected.`);
			case "term":
				const operator = getOperator(tokens)
				if (operator) {
					if (!rightmostNode) rightmostNode = currentNode;
					last = "operator";
					switch (getRank(operator)) {
						case 1:
						case 2:
							if (rightmostNode) rightmostNode.extend(operator);
							break;
						case 3:
							if (currentNode) {
								currentNode.extend(operator);
								rightmostNode = currentNode;
							}
					}
					continue;
				}
				throw new SyntaxError(`unexpected token '${tokens.shift()}': operator expected.`);
		}
	}
	if (parenthesisIndices.length) throw new SyntaxError(`unexpected end of input : ${last == "operator" ? "value or expression" : "operator/closing bracket"} expected.`);
	if (last == "operator" || rootNode == null) throw new SyntaxError("unxpected end of input: value or expression expected");
	return rootNode
}

function add(a: Polynomial | string | number, b: Polynomial | string | number) {
	let sum = new Polynomial();
	if (!isNaN(Number(a)) && !isNaN(Number(b))) {
		sum.add(new Term(new Exponential(Number(a) + Number(b))));
		return sum
	}
	if (!(a instanceof (Polynomial))) a = new Polynomial(new Term(new Exponential(a)));
	if (!(b instanceof (Polynomial))) b = new Polynomial(new Term(new Exponential(b)));
	for (let operand of [a, b]) {
		for (let term of operand.terms)
			sum.add(term);
	}
	return sum;
}

function multiply(a: Polynomial | string | number, b: Polynomial | string | number) {
	if (!(b instanceof Polynomial)) b = new Polynomial(b);
	if (!(a instanceof Polynomial)) a = new Polynomial(a);
	let product = new Polynomial();
	for (let bTerm of b.terms) {
		for (let aTerm of a.terms)
			product.add(new Term(...aTerm.variables, new Exponential(aTerm.coefficient), ...bTerm.variables, new Exponential(bTerm.coefficient)));
	}
	return product;
}

function subtract(a: Polynomial | string | number, b: Polynomial | string | number) {
	let sum = new Polynomial();
	if (!isNaN(Number(a)) && !isNaN(Number(b))) {
		sum.add(new Term(new Exponential(Number(a) - Number(b))));
		return sum
	}
	if (!(a instanceof (Polynomial))) a = new Polynomial(new Term(new Exponential(a)));
	if (!(b instanceof (Polynomial))) b = new Polynomial(new Term(new Exponential(b)));
	for (const term of a.terms) sum.add(term);
	for (let term of b.terms) {
		const negativeTerm = new Term(new Exponential(-term.coefficient), ...term.variables);
		sum.add(negativeTerm);
	}
	return sum;
}

function raiseToPower(a: Polynomial, b: Polynomial) {
	return new Polynomial(new Term(new Exponential(a, b)));
}

function parse(expression: string) {
	let tree = getAllTerms(tokenize(expression));
	return evaluate(tree);
}
function evaluate(tree: Tree<string | number>): Polynomial {
	if (tree.isLeaf) {
		let coefficient = (tree.cargo as string)[0] == "+" ? 1 : -1;  //if the value has positive or negative sign in front
		return new Polynomial(new Term(new Exponential(coefficient), new Exponential((tree.cargo as string).substring(1))));
	} else if (tree.left && tree.right) {
		let left = evaluate(tree.left);
		let right = evaluate(tree.right);
		switch (tree.cargo) {
			case "*": return multiply(left, right);
			case "+": return add(left, right);
			case "^": return raiseToPower(left, right);
			case "-": return subtract(left, right);
		}
	}
	throw new TypeError("cannot evaluate invalid expression tree")
}

const extensions: { [className: string]: new (...args: any) => any } = {
	"Fraction": Fraction,
	"Term": Term,
	"Exponential": Exponential,
	"Polynomial": Polynomial
}


export {
	enableForm,
	disableForm,
	factors,
	isSquare,
	makeWhole,
	sqRoot,
	lowestRatios,
	isFactorOf,
	multiply,
	divide,
	combination,
	factorial,
	Fraction,
	Term,
	restorePrototype,
	parse,
	getAllTerms,
	tokenize,
	Exponential,
	Polynomial,
}