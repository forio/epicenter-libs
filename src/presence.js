import * as router from './router.js';

export async function group(obj) {

    return await router.GET(`/presence/group/${obj.groupKey}`, router.toRoute(obj));
}

export async function world(obj) {

    return await router.GET(`/presence/world/${obj.worldKey}`, router.toRoute(obj));
}
