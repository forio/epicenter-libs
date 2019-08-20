import * as router from './router.js';
import * as store from './store.js';
import * as utility from './utility.js';

export async function authenticate(token) {

    let response = await router.POST('/authentication', token, router.toRoute(token), false);

    store.StorageManager.setItem(utility.AUTH_TOKEN, response.body.session);

    return response;
}

export async function upgrade(upgrade) {

    let response = await router.PATCH('/authentication', upgrade, router.toRoute(upgrade));

    store.StorageManager.setItem(utility.AUTH_TOKEN, response.body.session);

    return response;
}


