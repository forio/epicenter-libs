import Router from './router.js';

export async function forGroup(groupKey, options = {}) {
    const { accountShortName, projectShortName } = options;
    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(`/presence/group/${groupKey}`);
}

export async function forWorld(worldKey, options = {}) {
    const { accountShortName, projectShortName } = options;
    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(`/presence/world/${worldKey}`);
}
