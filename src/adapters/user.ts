import { Router } from 'utils/index';

interface UploadOptions extends GenericAdapterOptions {
    groupKey?: string,
    overwrite?: boolean,
}

// /**
//  * Time API adapter -- handles getting the current server time
//  * @namespace timeAdapter
//  */

// /**
//  * Fetches the current server time
//  *
//  * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/time`
//  *
//  * @memberof timeAdapter
//  * @example
//  *
//  * import { timeAdapter } from 'epicenter';
//  * const worlds = await timeAdapter.get();
//  *
//  * @param {object}  [optionals={}]                  Optional parameters
//  * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
//  * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
//  * @returns {string}                                The current server time, in ISO 8601 format
//  */

// const NOT_FOUND = 404;
// export async function get(
//     optionals: GenericAdapterOptions = {}
// ):Promise<void | string> {
//     const { accountShortName, projectShortName } = optionals;
//     return await new Router()
//         .withAccountShortName(accountShortName)
//         .withProjectShortName(projectShortName)
//         .get('/time')
//         .catch((error) => {
//             if (error.status === NOT_FOUND) return { body: undefined };
//             return Promise.reject(error);
//         }).then(({ body }) => body);
// }

export async function uploadCSV(
    file: File,
    optionals: UploadOptions = {}
):Promise<void> {
    const {
        overwrite,
        accountShortName, projectShortName,
    } = optionals;

    const formdata = new FormData();
    formdata.append('file', file);

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .withSearchParams({ overwrite })
        .post('/user/upload', { body: formdata })
        .then(({ body }) => body);
}
