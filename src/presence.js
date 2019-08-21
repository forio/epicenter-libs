import * as router from './router.js';

export async function forGroup(obj) {

    return await router.GET(`/presence/group/${obj.groupKey}`, router.toRoute(obj));
}

export async function forWorld(obj) {

    return await router.GET(`/presence/world/${obj.worldKey}`, router.toRoute(obj));
}
