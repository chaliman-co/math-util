import { Fraction, isSquare, makeWhole, parse, sqRoot } from "../utils";
export function quadraticRoots(func: string){
	// let variable, illegalToken, variableCheck=/[a-zA-Z]/g;
	// if(/[a-zA-Z]/.test(func)) var x = variable = /[a-zA-Z]/.exec(func)[0];                                    //the variable in func
	// else throw new Error("Argument Is Not A Quadratic Function.");
	// try{
	// 	let a_match = ``, b_match = ``, c_match, value;
	// 	var b_pattern = new RegExp(`([\\+\\-](\\d*(?:\\.\\d+)?)?${x}(?![^\\+\\-]*2))|(^(\\d*(?:\\.\\d+)?)?${x}(?![^\\+\\-]*2))`),                   //positive/negative integer/decimal number before x but not x(2)
	// 	c_pattern = new RegExp(`([\\+\\-](\\d+(?:\\.\\d+)?|(?:\\.\\d+))(?![${x}\\d\\.]))|(^((\\d+(?:\\.\\d+)?)|((?:\\.\\d+)))(?![${x}\\d\\.]))`),                            //positive/negative integer/decimal no. that doesn't occur before an x
	// 	a_pattern = new RegExp(`[\\+\\-]?(\\d*(?:\\.\\d+)?)?${x}\\^?\\(?2\\)?`),                       //positive/negative integer/decimal no. before x(2)
	// 	funcWithoutA =func.replace(new RegExp(a_pattern,"g"),""),                                      //remove a from func, for c_pattern not to match 2
	// 	a = (~func.search(a_pattern) && !isNaN(value = parseFloat(a_match = func.match(a_pattern)[0]))? value : 
	// 	~a_match.search(`-${x}`)? -1 : ~a_match.search(`^[\+]?${x}`)? 1 : 0),
	// 	b = (~func.search(b_pattern) && !isNaN(value = parseFloat(b_match = func.match(b_pattern)[0]))? value :      //set b to 0 or the occurence of b_pattern
	// 	~b_match.search(`-${x}`)? -1 : ~b_match.search(`^[\+]?${x}`)? 1 : 0),
	// 	c = (c_match = funcWithoutA.match(c_pattern))? parseFloat(c_match[0]) : 0;                     //set c to 0 or the occurence of c_pattern
	// }
	// catch(error){
	// 	if(func=="") throw new Error("No Arguments Supplied");
	// 	throw new Error("Invalid format!");
	// }
	// checkforErrors: {
	// 	while(variableCheck.test(func)){
	// 		if(func[variableCheck.lastIndex-1] !== variable) throw new Error("Function Is Not In One Variable");
	// 	};
	// 	a_pattern.lastIndex=b_pattern.lastIndex=c_pattern.lastIndex = 0;
	// 	variableCheck = /[a-zA-Z]/g;
	// 	if(!illegalToken){ a_pattern.lastIndex=b_pattern.lastIndex=c_pattern.lastIndex=0;
	// 		if(func.match(/\(/) && !func.match(/\)/)) throw new Error (`Invalid Input! Unterminated \(`);
	// 		if(func.match(/\)/) && !func.match(/\(/)) throw new Error(`Invalid Input! Unexpected token \)`);
	// 		if(illegalToken=func.match(/[\+\-][\+\-]/) || func.match(/\)[^\+\-]/)) throw new Error(`Invalid Input! Illegal Sequence ${illegalToken}`);
	// 		if(illegalToken=func.replace(a_pattern,"").replace(b_pattern,"").replace((funcWithoutA.match(c_pattern))? funcWithoutA.match(c_pattern)[0]: "","")) throw new Error(`Invalid Input! Unexpected Token ${illegalToken+(func[func.lastIndexOf(illegalToken[illegalToken.length-1])+1]||" ")}`);
	// 	}
	// 	if(a==0) throw new Error("Argument Is Not A Quadratic Function");
		
	// };
	var variable,
	a = 0,
	b = 0,
	c = 0;
	var poly = parse(func).flatten();
	if (poly.multivariable) throw new TypeError("Input has more than one variable");
	if (poly.degree != 2) throw new TypeError("Input is not a quadratic function");
	for (let term of poly.terms) {
		if (!term.variables.length)  {
			c = term.coefficient;
			continue;
		}
		if (term.variables[0].power == 2) {
			a = term.coefficient;
			variable = term.variables[0].base;
		}
		else if (term.variables.length === 1 && term.variables[0].power == 1) b = term.coefficient;
		else throw new TypeError("Input is not a quadratic function");
	}
	var wholes = makeWhole(a,b,c);                                        //make all the coefficients  whole numbers
		a = wholes.numbers[0], b = wholes.numbers[1], c = wholes.numbers[2];
	let D = (b * b) - 4 * (a * c);
	if((D>=0) && isSquare(D)){                       //if determinant is a positive perfect square
		var ans1num = -b + Math.sqrt(D), ans1 = new Fraction(ans1num,2*a).toLowestTerms();
		var ans2num = -b - Math.sqrt(D), ans2 = new Fraction(ans2num,2*a).toLowestTerms();
		return {type:"simple",ans1,ans2,variable}
	}
	else{
		var determinant = new Fraction(sqRoot(D),2*a).toLowestTerms();                                    //find the square root of the determinant(in surd/complex form) and divide it by 2a
		determinant.nume = determinantNumeFormat(String(determinant.nume));                                         //format the numerator for display. 
		var first = new Fraction(-b,2*a).toLowestTerms();                                                   //divide the first part(-b) by 2a and reduce to lowest terms
		return {type:"surd/complex",first,determinant,variable};
	}
	
	//HELPER FUNCTIONS
	
	function determinantNumeFormat(nume: string){
		var f = parseInt(nume);
		if(f) nume = nume.replace(f.toString(), f==1 || f==-1? "":f.toString());            //We don't need unity coefficient in front of squareRoot
		if(nume[0]=="-") nume = nume.replace(/^-/,"");                                 //Because of the (+-) to appear before the numerator, - sign doesn't matter at all
		return nume
	};
}
