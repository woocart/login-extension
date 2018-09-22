import select from 'select-dom';

export default async function injectLogin() {
	if (document.location.pathname !== '/wp-login.php') {
		return;
	}

	const port = chrome.runtime.connect({name: document.location.hostname});

	port.onMessage.addListener(msg => {
		if (msg.stores) {
			const host = document.location.hostname.replace('www.', '');
			for (const store of msg.stores) {
				if (host.indexOf(store.domain) > -1) {
          port.postMessage({domain: document.location.hostname});

          user.value = msg.user;
          pass.value = msg.pass;
				}
			}
    }
    if (msg.user && msg.pass) {
      const user = select('#user_login');
      const pass = select('#user_pass');
      user.value = msg.user;
      pass.value = msg.pass;
      var temp = document.createElement('div');
      temp.innerHTML = '<p class="message" style="border-left: 4px solid #512089;">Login provided by WooCart.<br></p>';
      document.querySelector("h1").append(temp);
    }
	});
	port.postMessage({list: true});
}
