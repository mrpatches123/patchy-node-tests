const players = [{ x: 22, z: 22 }, { x: 1, z: 5 }];
/**
 * @param {{r: number, theta: number}} radians 
 * @param {{x: number, z: number}} center 
 * @returns  {{x: number, z: number, theta: number, r: number}}
 */
function circularToCartesian(vectorCircular, center = { x: 0, z: 0 }) {
	const { x, z } = center;
	return ({ x: radius * Math.cos(radians) + x, z: radius * Math.sin(radians) + z, theta: radians, r: radius });
}
/**
 * @param {{x: number, z: number}} vector 
 * @param {{x: number, z: number}} center 
 * @returns {x: number, z: number, theta: number, r: number}
 */
function cartesianToCircular(vector, center = { x: 0, z: 0 }) {
	const { x, z } = vector;
	const { x: xc, z: zc } = center;
	const r = Math.sqrt((x - xc) ** 2 + (z - zc) ** 2);
	return ({ theta: Math.acos((x - xc) / r), r, x, z });
}
const oneRotation = 2 * Math.pi();
/**
 * @param {number} minR 
 * @param {number} maxR 
 * @param {{x: number, z: number}[]} vectors 
 * @param {{x: number, z: number}} center 
 * @re
 */
function getCircularRandomRangeOppositeFromVectors(minR, maxR, vectors = [], center = { x: 0, z: 0 }) {
	let vectorsInRange = vectors.map((vector) => cartesianToCircular(vector, center))
		.filter(({ r }) => r >= minR && r <= maxR).sort(({ thetaA }, { thetaB }) => thetaA - thetaB);
	if (!vectorsInRange.length) return { minR, maxR, mintheta: 0, maxtheta: oneRotation };
	else if (vectorsInRange.length > 2) {
		const AjectentVectors = [];
		for (let a = 0, b = 1; b < vectorsInRange.length; a++, b++) {
			if (b === vectorsInRange.length) {
				const aV = vectorsInRange[0];
				const bV = vectorsInRange[a];
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
		return { minR, maxR, mintheta: oneRotation - maxVector.theta, maxtheta: oneRotation - minVector.theta };
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
getCircularRandomRangesFromVectors(0, 10, players);