import path from 'path';
import fs from 'fs';
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
 * @returns {{x: number, z: number, theta: number, r: number}}
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
				aV.theta += oneRotation;
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
		const mintheta = Math.min(minVector.theta, maxVector.theta);
		const maxtheta = Math.max(minVector.theta, maxVector.theta);
		return { minR, maxR, mintheta: mintheta + mintheta / 8, maxtheta: maxtheta - mintheta / 8, center };
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
function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
const players = Array.from(new Array(10), () => ({ x: randomInt(-10, 10), z: randomInt(-10, 10) }));
const test = getCircularRandomRangeOppositeFromVectors(0, 100, players);
console.log(test);
const graphThing = `<!DOCTYPE html>
<html>

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">


	<script src="https://www.desmos.com/api/v1.8/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6"></script>



</head>

<body>
	<div id="calculator" style="width: 700px; height: 400px;"></div>

	<script>
		var elt = document.getElementById('calculator');
		var calculator = Desmos.GraphingCalculator(elt);
		calculator.setExpression({ id: 'graph1', latex: '${players.map(({ x, z }) => `(${x},${z})`).join(',')}' });
		calculator.setExpression({ id: 'graph2', latex: 'r=5 {{${test.mintheta}<\\\\theta<${test.maxtheta}}}'});

	</script>


</body>

</html>`;
const htmlPath = path.resolve('./graph.html');
console.log(htmlPath);
fs.writeFileSync(htmlPath, graphThing);
