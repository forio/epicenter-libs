import type { GenericSearchOptions } from '../utils/constants';
import type { RoutingOptions } from '../utils/router';
import { Router } from '../utils';
/**
 * Adds somebody to an account; somebody is a person who is not a user, but whose information is used in a simulation; requires support level authentication
 *
 * Base URL: POST `https://forio.com/api/v3/{accountShortName}/{projectShortName}/somebody`
 *
 * @example
 * const email = 'test@test.com';
 * const optionals = {
 *      givenName: 'Person',
 *      familyName: 'Family',
 *      acountId: '12345',
 * }
 *
 * epicenter.somebodyAdapter.create(email, optionals);
 *
 * @param {string}  email                           Email of the person being added

 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.givenName]           Given name of new user
 * @param {string}  [optionals.familyName]          Family name of new user
 * @param {string}  [optionals.accountId]           Account Id of new user
 * @returns {somebodyObject}                        Returns a promise that resolves to the newly created somebody
 */
export async function create(
    email: string,
    optionals: {
        givenName?: string;
        familyName?: string;
        accountId?: string;
    } & RoutingOptions = {}
): Promise<Record<string, unknown>> {
    const {
        givenName,
        familyName,
        accountId,
        ...routingOptions
    } = optionals;
    return await new Router()
        .post(
            '/somebody',
            {
                body: {
                    email,
                    givenName,
                    familyName,
                    accountId,
                },
                ...routingOptions,
            }
        )
        .then(({ body }) => body);
}

/**
 * Open search for somebody, returns a page
 * 
 * Base URL: GET `https://forio.com/api/v3/{accountShortName}/{projectShortName}/somebody/search`
 * 
 * @example
 * epicenter.somebodyAdapter.query({
 *      filter: [
 *          'email|=email1@email.com|email2@email.com',         // looks for any rooms with the names provided
 *          // 'givenName=Person',                              // used in conjunction with the scopeBoundary
 *          // 'familyName=PersonLastName',  // searches for a specific chat
 *          // 'accountId=0000017dd3bf540e5ada5b1e058f08f20461',  // searches for a specific accountId
 *          // 'accountShortName=acme',                         // specifies the account, typically unnecessary
 *          // 'projectShortName=simulations',                  // specifies the project, typically unnecessary

 *      ],
 *      sort: ['+somebody.email'],    // sort all findings by the 'created' field (ascending)
 *      first: 3,                   // page should start with the 4th item found (defaults to 0)
 *      max: 10,                    // page should only include the first 10 items
 *      count: false,               // If set to true this will return the number of somebodies that match the search
 * });
 * @param searchOptions Search options -- for more on Epicenter search options go [here](NOOP link)
 * @param [optionals]   Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @returns A page for the list of sombodies found
 */
export async function query(
    searchOptions: GenericSearchOptions,
    optionals: RoutingOptions = {}
): Promise<Record<string, unknown>> {
    const { filter = [], sort = [], first = 0, max, count = false } = searchOptions;
    const searchParams = {
        filter: filter.join(';') || undefined,
        sort: sort.join(';') || undefined,
        first, max, count,
    };
    return await new Router()
        .withSearchParams(searchParams)
        .get('/somebody/search', {
            paginated: true,
            ...optionals,
        })
        .then(({ body }) => body);
}