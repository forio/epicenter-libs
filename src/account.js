import * as router from './router.js';

export async function create(createDto) {

    return await router.POST('/account', createDto, null);
}

// should take an updater
export async function update(updateDto) {

    return await router.PATCH('/account', updateDto, null);
}

export async function remove(accountShortName) {

    return await router.DELETE('/account', new router.RouteBuilder().withAccountShortName(accountShortName).build());
}