
class ArrayType<T> {
	type: T;
	constructor(type: T) {
		this.type = type;
	}
}
class RecordType<V> {
	type: V;
	constructor(type: V) {
		this.type = type;
	}
}
const formSchemaObject = {
	action: {
		schema: {
			global: {
				title: {
					schema: [String, undefined],
					formMethod: true,
				},
				body: {
					schema: [String, undefined],
					formMethod: true,
				},
				pressCallback: {
					schema: [Function, undefined],
				},
				closeCallback: {
					schema: [Function, undefined],
				},
				callback: {
					schema: [Function, undefined],
				},
				returnOnPress: {
					schema: [Boolean, undefined]
				},
				returnOnClose: {
					schema: [Boolean, undefined]
				}
			},
			button: {
				schema: {
					text: String,
					iconPath: [String, undefined],
					reopen: [Boolean, undefined]
				},
				customProperties: ['reopen'],
				hasCallback: true
			},
			back: {
				root: 'button',
				schema: {
					text: String,
					iconPath: [String, undefined],
				},
				setupFunction: () => {
					console.log("back: ranSetupFunction");
				},
				hasCallback: true
			},
			refresh: {
				root: 'button',
				schema: {
					text: String,
					iconPath: [String, undefined],
				},
				setupFunction: () => {
					console.log("refresh: ranSetupFunction");
				},
				hasCallback: true
			},
			toggle: {
				custom: true,
				schema: {
					options: new ArrayType({
						text: String,
						iconPath: [String, undefined],
						callback: [Function, undefined],
					}),
					cycleCallback: Function,
					initialisationFunction: Function,
					reopen: [Boolean, undefined]
				},
				setupFunction: () => {
					console.log("toggle: ranSetupFunction");
				},
				hasCallback: true
			}
		}
	}
};
const fromData = {
	action: [
		{
			button: {
				text: 'test',
				iconPath: 'test',
				reopen: true
			}
		}
	]
};
class Form {
	checkSchema(schema: any, target: any, root: boolean, stack: string) {
		Object.entries(schema).forEach(([elementKey, value]) => {
			if (root && elementKey === 'global') this.checkSchema(value, target, root, stack);
			else if (elementKey === 'schema') this.checkSchema(value, target[elementKey], root, stack);

		});
	}
}
const formBuilder = new Form();
formBuilder.checkSchema(formSchemaObject.action, fromData['action'][0], true, '');