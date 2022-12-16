const primeCache: { [n: number]: number } = { 1: 2, 2: 3, 500000: 7368787, 1000000: 15485863 };
export function findPrime(x: number) {
		if (isNaN(x) || x < 1 || x > 100000000) throw new Error("Input Out Of Range");
		if (x in primeCache) return primeCache[x];        //if the x prime has been calculated, return the cached answer
		var count, number, x = Number(x), nearestIndex = Math.floor(x / 5000) * 5000;
		if (nearestIndex in primeCache) {
			count = nearestIndex;
		} else {
			count = Object.keys(primeCache)
			.map(x => Number(x))
			.reduce(function (least, num) { 
				let result;
				if (num < x && num > least) { least = num }; return least; }, 0)
		}
		number = primeCache[count];
		while (count < x) {
			if (isPrime(number + 2)) {
				++count;
				if (count % 5000 === 0) primeCache[count] = number + 2;
			}
			number += 2;
		}
		return number
	}

	function isPrime(x: number) {
		if (x == 2) return true;
		if (x == 1 || x % 2 == 0) return false;
		var count = 3, limit = Math.sqrt(x) + 1;
		while (count < limit) {
			if (x % count == 0) return false;
			count += 2;
		}
		return true
	}
