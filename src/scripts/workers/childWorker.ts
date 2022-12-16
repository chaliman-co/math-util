import { convertToBase } from "../solvers/baseConverter";
import { findPrime } from "../solvers/prime";
import { quadraticRoots } from "../solvers/quadratic";
import { polynomialExpand } from "../solvers/polynomial";
onmessage = function (message) {
	if (message.data._subworker) return;
	let
		answer,
		args: Array<any> = message.data.args,
		funcName = message.data.funcName,
		messageId: string = message.data.id;
	try {
		switch (funcName) {
			case "findPrime":
				answer = findPrime(args[0] as number); break;
			case "convertToBase":
				answer = convertToBase(args[0] as string, args[1], args[2]); break;
			case "quadraticRoots":
				answer = quadraticRoots(args[0]); break;
			case "polynomialExpand":
				answer = polynomialExpand(args[0]);

		}
		postMessage({ answer, id: messageId, type: "answer" });
	} catch (error) {
		dispatchError(error, messageId);
	}
}

function dispatchError(error: any, id: string) {                                                  //dispatches an error from a worker to its creator
	var errorClone: {[prop: string]: any}= {}, errorProperties = Object.getOwnPropertyNames(error);
	for (let i of errorProperties) {
		errorClone[i] = error[i];
	}
	postMessage({ type: "error", errorClone, id });
}