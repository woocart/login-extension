global.portMock = {
	postMessage: jest.fn(),
	onMessage: {
		addListener: jest.fn()
	}
}
global.chrome = {}
global.chrome.runtime = {
	onConnect: {
		addListener: jest.fn()
	},
	connect: () => {
		return portMock
	}
}
global.chrome.storage = {
	onChanged: {
		addListener: jest.fn()
	},
	sync: {
		get: jest.fn(),
		set: jest.fn()
	}
}
