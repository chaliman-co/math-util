const utils = require("../utils")
export function convertToBase(number: string, base: number, newBase: number) {
	let value;
	number = number.toString().toLowerCase();

	//Defensive Assertions
	if (!(/\b\w+\b/.test(number + base + newBase))) throw new Error("Invalid Input")
	if (base > 36 || newBase > 36) throw new Error("Conversions Above Base 36 Not Supported!");
	if (base < 2 || newBase < 2) throw new Error("Conversions Below Base 2 Not Supported!");
	for (var i = 0; i < number.length; ++i) { //check if digits in number is within the base range
		if (number.charCodeAt(i) < 58) {
			if (Number(base) + 48 <= number.charCodeAt(i)) throw new Error(`${number} Is Not A Base ${base} Number`);
		} else {
			if (number.charCodeAt(i) - 87 >= base) throw new Error(`${number} Is Not A Base ${base} Number`);
		}
	}
	//MAIN

	let answer = base10ToBaseN(toBase10(number, base), newBase); //convert number to base10, then convert to new base
	return answer
	//HELPER FUNCTIONS

	function toBase10(number: string | number, base: number) { //converts number to base10# 
			number = number.toString();
		var wholeResult = 0,
			floatResult = 0,
			pointIndex = ~number.indexOf(".") ? number.indexOf(".") : Infinity;
		let [whole, float] = [number.slice(0, pointIndex), number.slice(pointIndex + 1)];
		for (let i = whole.length - 1, j = 0; i >= 0; --i, ++j) {
			wholeResult += Math.pow(base, j) * (whole.charCodeAt(i) < 58 ? Number(whole[i]) : whole.charCodeAt(i) - 87);
		}
		if (!float) return wholeResult;
		for (let placeValue: number, digit: number, i = 0, j = 1; i < float.length; ++i, ++j) {
			digit = float.charCodeAt(i) < 58 ? Number(float[i]) : float.charCodeAt(i) - 87;
			placeValue = Math.round(digit / Math.pow(base, j) * Math.pow(10, 15)) / Math.pow(10, 15);
			floatResult = Math.round((floatResult + placeValue) * Math.pow(10, 15)) / Math.pow(10, 15);
		}
		return Math.round((wholeResult + floatResult) * Math.pow(10, 15)) / Math.pow(10, 15);
	}

	function base10ToBaseN(number: number, n: number) { //Assumes number is in base10, converts it to baseN 
		if (number > Number.MAX_SAFE_INTEGER) return number.toString(n);
		const numberFixed = ~String(number).indexOf("e") ? number.toFixed(15).replace(/0+$/, ``) : number.toString();
		let floatResult, wholeResultDigits = [],
			pointIndex = ~numberFixed.indexOf(".") ? numberFixed.indexOf(".") : Infinity,
			[whole, float] = [Number(numberFixed.slice(0, pointIndex)), parseFloat(numberFixed.slice(pointIndex))],
			fraction = float ? (new utils.Fraction(float).toLowestTerms()) : null;
		while (whole > 0) {
			let digit = whole % n;
			wholeResultDigits.push(digit < 10 ? whole % n : String.fromCharCode(digit + 87));
			whole = Math.floor(whole / n);
		}
		const wholeResult = Number(wholeResultDigits.reverse().join("")) || 0;
		if (fraction) {
			//[fraction.nume] = [base10ToBaseN(fraction.nume, n)];
			floatResult = ".";
			let placeDigit, nume = fraction.nume;
			const d = Number(fraction.denom);
			while ((floatResult.length < 60) /*&& toBase10(wholeResult + ((floatResult+0)||""),n)<Number(number)*/ ) {
				// nume += 0;
				// if(Number(toBase10(nume,n))<d){floatResult+=0; continue};
				// placeDigit = base10ToBaseN(Math.floor(toBase10(nume,n)/d),n);
				// nume = base10ToBaseN(Number((toBase10(nume,n) % d).toFixed(15)),n);
				// floatResult += placeDigit;

				// This method works too.
				// let product = Math.round(float * n * Math.pow(10,14))/Math.pow(10,14);
				// floatResult += base10ToBaseN(Math.floor(product),n);
				// float = String(product).replace(/^\d+/,``)

				nume *= n;
				placeDigit = Math.floor((nume) / d);
				floatResult += base10ToBaseN(placeDigit, n)
				nume = nume % d;
			}
		}
		return (wholeResult + (floatResult || "")).replace(/(\.\w+?)0+$/g, "$1");
	}
}
