import { Router } from 'utils';


/**
 * Project API adapters -- project stuff TODO
 * @namespace projectAdapter
 */


/**
 * Makes a connection request to the cometd server; effectively marking the user as online; using [logout](#authAdapter-logout) will automatically disconnect for you.
 *
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/project/channel/isEnabled`
 *
 * @memberof projectAdapter
 * @example
 *
 * epicenter.projectAdapter.channelsEnabled()
 *
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {Promise}                               Promise resolving true/false whether or not the project supports the use of push channels
 */
export async function channelsEnabled(optionals = {}) {
    const { accountShortName, projectShortName } = optionals;
    const response = await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get('/project/channel/isEnabled')
        .then(({ body }) => body);

    return response;
}

