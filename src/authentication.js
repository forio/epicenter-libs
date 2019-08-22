import Router from './router.js';
import store from './store.js';
import * as utility from './utility.js';

export async function authenticate(options) {
    const { handle, password, group, objectType = 'user', ...others } = options;
    const { accountShortName, projectShortName } = others;

    const response = await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .post('/authentication', {
            body: { handle, password, group, objectType },
            includeAuthorization: false,
        });

    store.setItem(utility.AUTH_TOKEN, response.body.session);
    return response;
}

export async function upgrade(options) {
    const { objectType = 'admin', ...others } = options;
    const { accountShortName } = others;
    
    const response = await new Router()
        .withAccountShortName(accountShortName)
        .patch('/authentication', {
            body: { objectType },
        });

    store.setItem(utility.AUTH_TOKEN, response.body.session);
    return response;
}


