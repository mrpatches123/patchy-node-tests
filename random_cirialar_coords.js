
/**
 * @param {{r: number, theta: number}} radians 
 * @param {{x: number, z: number}} center 
 * @returns  {{x: number, z: number, theta: number, r: number}}
 */
function circularToCartesian(vectorCircular, center = { x: 0, z: 0 }) {
	const { x, z } = center;
	return ({ x: radius * Math.cos(radians) + x, z: radius * Math.sin(radians) + z, theta: radians, r: radius });
}
const oneRotation = Math.PI * 2;
/**
 * @param {{x: number, z: number}} vector 
 * @param {{x: number, z: number}} center 
 * @returns {x: number, z: number, theta: number, r: number}
 */
function cartesianToCircular(vector, center = { x: 0, z: 0 }) {
	const { x, z } = vector;
	const { x: xc, z: zc } = center;
	const r = Math.sqrt((x - xc) ** 2 + (z - zc) ** 2);
	let theta = Math.atan2(z - zc, x - xc);
	console.log(theta);
	if (theta < 0) theta = oneRotation + theta;
	return ({ theta, r, x, z });
}
console.log(cartesianToCircular({ x: -1, z: -0.1 }));

/**
 * @param {number} minR 
 * @param {number} maxR 
 * @param {{x: number, z: number}[]} vectors 
 * @param {{x: number, z: number}} center 
 * @re
 */
function getCircularRandomRangeOppositeFromVectors(minR, maxR, vectors = [], center = { x: 0, z: 0 }) {
	let vectorsInRange = vectors.map((vector) => cartesianToCircular(vector, center))
		.filter(({ r }) => r >= minR && r <= maxR).sort(({ theta: thetaA }, { theta: thetaB }) => thetaA - thetaB);
	console.log(vectorsInRange);
	if (!vectorsInRange.length) return { minR, maxR, mintheta: 0, maxtheta: oneRotation };
	else if (vectorsInRange.length > 2) {
		const AjectentVectors = [];
		for (let a = 0, b = 1; b < vectorsInRange.length; a++, b++) {
			if (b === vectorsInRange.length - 1) {
				const aV = vectorsInRange[0];
				const bV = vectorsInRange[b];
				const test = aV > bV;
				AjectentVectors.push([(test) ? bV : aV, (test) ? aV : bV, Math.abs(aV.theta - bV.theta)]);
				continue;
			}
			const aV = vectorsInRange[a];
			const bV = vectorsInRange[b];
			const test = aV > bV;

			AjectentVectors.push([(test) ? bV : aV, (test) ? aV : bV, Math.abs(aV.theta - bV.theta)]);
		}
		const [minVector, maxVector] = AjectentVectors.sort((a, b) => b[2] - a[2])[0];
		console.log({ minVector, maxVector });
		return { minR, maxR, mintheta: minVector.theta, maxtheta: maxVector.theta };
	} else if (vectorsInRange.length === 2) {
		const [aV, bV] = vectorsInRange;
		const test = aV > bV;
		return { minR, maxR, mintheta: oneRotation - ((test) ? aV : bV).theta, maxtheta: oneRotation - ((test) ? bV : aV).theta };
	} else if (vectorsInRange.length === 1) {
		const [aV] = vectorsInRange;
		return { minR, maxR, mintheta: aV.theta + oneRotation / 4, maxtheta: aV.theta - oneRotation / 4, center };
	}
	console.log(vectorsInRange);
}
const players = [{ x: 2, z: -4 }, { x: 3, z: -5 }, { x: -8, z: -3 }, { x: -2, z: 5 }, { x: 1, z: 5 }];
console.log(getCircularRandomRangeOppositeFromVectors(0, 100, players));