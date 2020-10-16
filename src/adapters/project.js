import { Router } from 'utils';

export async function channelsEnabled(optionals = {}) {
    const { accountShortName, projectShortName } = optionals;
    const response = await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get('/project/channel/isEnabled')
        .then(({ body }) => body);

    return response;
}