import { parse } from "../utils";

export function polynomialExpand(func: string){
	// let nC, sA, sB, sC;                                               //Numeric coefficient, sign coefficient
	// var a_match = /[\+\-]?\w+(?=[\+\-])/,
	// b_match = /[\+\-]\w+(?=\))/,
	// n_match = /((\([\+]?\d+\))|([\+]?\d+))$/,
	// n =  n_match.test(func)?  parseInt(n_match.exec(func)[0].replace(/^[^\+\-\d]+/,"")): 1,
	// a = new String(a_match.exec(func)[0]),
	// b = new String(b_match.exec(func)[0]);
	// a.sign = b.sign = 1; 
	// if(sC = /^[\-\+]/.exec(a)){                           //if a is prefixed with a sign, 
	// 	a = new String(a.replace(sC[0],""));              // remove the sign and multiply the coefficient by it
	// 	a.sign =  sC[0]+1;
	// }
	// if(sC = /^[\-\+]/.exec(b)){
	// 	b = new String(b.replace(sC[0],""));
	// 	b.sign =  sC[0]+1;
	// }
	// if(nC=parseInt(a)){
	// 	let sign = a.sign;
	// 	a = new String(a.replace(/^[\+\-]?\d+/,""))
	// 	sign? (a.sign = sign*nC): (a.sign = nC); 
	// }
	// if(nC=parseInt(b)){
	// 	let sign = b.sign;
	// 	b = new String(b.replace(/^[\+\-]?\d+/,""))
	// 	sign? (b.sign = sign*nC): (b.sign = nC); 
	// }
	// if((sA = new Set(a)).size != a.length){
	// 	let duplicates = a;
	// 	for(let i of sA){
	// 		duplicates = duplicates.replace(i,"");
	// 	}
	// 	if(duplicates) throw new Error(`Duplicates {${Array.from(new Set(duplicates)).join()}} not allowed in left variable`)
	// };
	// if((sB = new Set(b)).size != b.length){
	// 	let duplicates = b;
	// 	for(let i of sB){
	// 		duplicates = duplicates.replace(i,"");
	// 	}
	// 	if(duplicates) throw new Error(`Duplicates {${Array.from(new Set(duplicates)).join()}} not allowed in right variable`)
	// }
	

	
	// let  power = 0, terms = [];
	// while(power<=n){
	// 	let
	// 		coefficient = utils.combination(n,power)*Math.pow(a.sign,n-power)*Math.pow(b.sign,power),                  //n Combination p
	// 		fvar = new utils.Exponential(a,n-power),                     //set first variable to a^(n-p)
	// 		svar = new utils.Exponential(b,power);                       //set Second variable to b^(p)
	// 		terms.push(new utils.Term(coefficient,fvar,svar));         //collect all in a new term.
	// 		++power
	// };
	// return terms;
	return parse(func).flatten().terms;
};
