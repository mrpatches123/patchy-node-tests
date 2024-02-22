import fs from 'fs';
import path from 'path';
function numberAddCode(max) {
	let functionCode = "";
	for (let a = 0; a < max; a++) {
		for (let b = 0; b < max; b++) {
			functionCode += `	if (a === ${a} && b === ${b}) return ${a + b};\n`;
		}
	}
	const string = `function numberAddCode(a,b) {
	${functionCode}
	}`;
	fs.writeFileSync(path.relative(process.cwd(), 'numberAddCode.js'), string);
}
numberAddCode(100);