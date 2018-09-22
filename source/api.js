async function getUser() {
  return fetch(
    `https://app.woocart.com/api/v1/user/`,
    {
      method: 'GET',
      credentials: 'include'
    }
  ).then(response => response.json());
}
async function getStores() {
  return fetch(
    `https://app.woocart.com/api/v1/stores/`,
    {
      method: 'GET',
      credentials: 'include'
    }
  ).then(response => response.json());
}

export default async function handleRequest(request, port) {
  console.log(request);
  let stores = [];
  if (sessionStorage.stores) {
    stores = JSON.parse(sessionStorage.stores);
  } else {
    stores = await getStores();
    sessionStorage.stores = JSON.stringify(stores);
  }

  let user = [];
  if (sessionStorage.user) {
    user = JSON.parse(sessionStorage.user);
  } else {
    user = await getUser();
    sessionStorage.user = JSON.stringify(user);
  }

  if (request.list) {
    port.postMessage({ stores });
    return;
  }

  if (request.loginInline) {
    let store;

    for (const rStore of stores) {
      if (rStore.id === request.loginInline) {
        store = rStore;
        break;
      }
    }

    if (store) {
      chrome.tabs.create({ url: `https://${store.domain}/wp-admin/` });
    }

    return;
  }

  if (!request.domain) {
    port.postMessage({ error: 'Missing domain in request.' });
    return;
  } else {
    // Handle www. prefix
    if (request.domain.indexOf('www.') === 0) {
      request.domain = request.domain.replace('www.', '');
    }
    let store;
    for (const rStore of stores) {
      if (rStore.domain === request.domain) {
        store = rStore;
        break;
      }
    }

    if (store) {
      port.postMessage({
        user: user.email,
        pass: store.wordpressPassword
      });
    } else {
      port.postMessage({ error: 'Not managed by WooShop.' });
    }
  }
}
