import { Router } from 'utils';

export async function get(groupKey, optionals = {}) {
    const { accountShortName, projectShortName, expired, withMembers } = optionals;

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .withSearchParams({ expired })
        .get(`/group/${withMembers ? 'member/' : ''}${groupKey}`)
        .then(({ body }) => body);
}


export async function update(groupKey, update, optionals = {}) {
    const { runLimit /* TODO: figure out what else goes here*/} = update;
    const { accountShortName, projectShortName } = optionals;

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .patch(`/group/${groupKey}`, {
            body: { runLimit },
        })
        .then(({ body }) => body);
}
