import { createWorker } from "../app_util"
require("../subworkerspolyfill")();
const workers: { [functionName: string]: Worker } = {};
onmessage = async function (message) {
	var funcName = message.data.funcName;
	if (!(workers[funcName])) {
		try {
			const childWorker = await createWorker("/workers/childworker.js");
			childWorker.addEventListener("message", function (message) {
				let response = message.data;
				postMessage(response);
			});
			childWorker.addEventListener("error", (error) => {
				if (!error.message) {
					dispatchError(new Error("Network Error", { cause: error.error }), message.data.id);
					childWorker.terminate();                                                           //bad worker. Will never work.
					delete workers[funcName];
				} else {
					dispatchError(new Error(error.message, { cause: error.error }), message.data.id);
				}
			});
			workers[funcName] = childWorker;
		} catch (error) {
			dispatchError(error as Error);
		}
		//relay the message to the functions's worker for processing.
	}
		workers[funcName].postMessage(message.data);
}

function dispatchError(error: Error, id: number | null = null) {                                                  //dispatches an error from a worker to its creator
	var errorClone: { [prop: string]: any } = {}, errorProperties = Object.getOwnPropertyNames(error);
	for (let i of errorProperties) {
		errorClone[i] = (error as any)[i];
	}
	postMessage({ type: "error", errorClone, id });
}

onerror = (error) => console.log({error})