import { sqRoot } from "../utils";

function rP(a: number, b: number): number { //race to power
	if (b == 0) {
		return 1
	};
	if (b % 2 == 0) {
		return rP(a * a, b / 2)  //Because a^b == a^2(b/2)
	}
	else {
		return a * rP(a, b - 1)  //Make the exponent even by subtracting 1
	}
}
class Vector {
	i: number;
	j: number;
	k: number;
	constructor(a: number, b: number, c: number) {
		this.i = a || 0;
		this.j = b || 0;
		this.k = c || 0;
	}
	toString() {
		return "(" + this.i + "i, " + this.j + "j, " + this.k + "k)";
	}

	magnitude() {
		return sqRoot(rP(this.i, 2) + rP(this.j, 2) + rP(this.k, 2));
	}

	valueOf() {
		return Math.sqrt(this.i ** 2 + this.j ** 2 + this.k ** 2);
	}

	add(other: Vector) {
		return new Vector(this.i + other.i, this.j + other.j, this.k + other.k);
	}

	minus(other: Vector) {
		return new Vector(this.i - other.i, this.j - other.j, this.k - other.k);
	}

	dot(other: Vector) {
		return (this.i * other.i) + (this.j * other.j) + (this.k * other.k);
	}

	cross(other: Vector) {
		var i = (this.j * other.k) - (other.j * this.k);
		var j = (this.i * other.k) - (other.i * this.k);
		var k = (this.i * other.j) - (other.i * this.j);
		return new Vector(i, -j, k)
	}
}


Object.defineProperties(Vector.prototype, {

});