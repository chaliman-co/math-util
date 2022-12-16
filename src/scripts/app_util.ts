import { restorePrototype } from "./utils";

export function createWorker(source: string): Promise<Worker> {
	return new Promise((resolve, reject) => {
		let worker = new Worker(source);
		resolve(worker)
	})
}

let mainWorker: Worker | null = null;
const mainWorkerCallbacks: {[id: number]: { resolve: (result: unknown) => void, reject: (err: any) => void }} = [];
 export async function runAsync(args: [...any], funcName: string): Promise<any> {           //runs a function asynchronously
  let id = crypto.getRandomValues(new Uint32Array(new ArrayBuffer(4)))[0];
  return new Promise(async (resolve: (value: unknown) => void, reject: (err: any) => void) => {
    if (!mainWorker) {
      try {
      mainWorker = await createWorker("/workers/mainworker.js");
      mainWorker.onmessage = function (message) {
        if (message.data._subworker) return;          //Do not process messages that are being relayed
        let ext;
        let messageId = message.data.id;
        let callback = mainWorkerCallbacks[messageId];
        if (message.data.type == "error") {
          let error = message.data.error || Object.assign(new Error(), message.data.errorClone);
          callback.reject(error);
        } else if (message.data.type == "answer") {
          let answer = message.data.answer;
          restorePrototype(answer);
          callback.resolve(answer);
        }
      };
      mainWorker.onerror = error => {
        let self = error.target;
        if (!error.message) {
          error = new ErrorEvent("Network Error", {error: new Error("Network Error")});
        }
        if (error.message.replace(/^.*Error:/, "").trim() === "Network Error" || error.error.message.replace(/^.*Error:/, "").trim() === "Network Error" ) {
          self?.dispatchEvent(new MessageEvent("message", { data: { type: "error", error: error.error, id } }));
          mainWorker?.terminate();
          mainWorker = null;                                                             //Destroy bad worker. It will never work.
        } else {
          self?.dispatchEvent(new MessageEvent("message", { data: { type: "error", error: error.error, id } }))
        }
      };
    } catch(err) {
      mainWorker = null;
      reject(err);
      return;
    }     
 }
      mainWorkerCallbacks[id] = { resolve, reject };
      solve(args, funcName, id);
})
}
function solve(args: any, funcName: string, id: number) {
  mainWorker?.postMessage({ args, funcName, id });
}