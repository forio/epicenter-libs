import * as router from './router.js';

export async function createAccount(createDto) {

    return await router.POST('/account', createDto);
}

// should take an updater
export async function updateAccount(updateDto) {

    return await router.PATCH('/account', updateDto);
}

export async function removeAccount(accountShortName) {

    return await router.DELETE('/account', new router.RouteBuilder().withAccountShortName(accountShortName).build());
}