import {default as handleRequest} from './api';

/* istanbul ignore next */
chrome.runtime.onConnect.addListener(port => {
	port.onMessage.addListener(async msg => {
		await handleRequest(msg, port);
	});
});
