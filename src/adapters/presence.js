import { Router } from 'utils';
import { cometdAdapter } from 'adapters';

export async function forGroup(groupKey, optionals = {}) {
    const { accountShortName, projectShortName } = optionals;
    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(`/presence/group/${groupKey}`)
        .then(({ body }) => body);
}

export async function forWorld(worldKey, optionals = {}) {
    const { accountShortName, projectShortName } = optionals;
    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(`/presence/world/${worldKey}`)
        .then(({ body }) => body);
}

export async function connect() {
    return cometdAdapter.handshake();
}
