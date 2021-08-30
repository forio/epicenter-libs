import {Router} from 'utils/index';

/**
 * Account API adapters -- account stuff TODO
 * @namespace accountAdapter
 */

interface Account {
    name: string,
    objectType: string
}

export async function createAccount(optionals = {}) {
    const {objectType = 'personal', name, shortName, adminKey, subscriptionPlan, billingInterval} = optionals;
    const response = await new Router()
        .post('/account', {
            body: {objectType, name, shortName, adminKey, subscriptionPlan, billingInterval},
        }).then(({body}) => body);
    return response;
}

// TODO -- just a copy-paste of create ATM; need to figuure out how to actually use
export async function updateAccount(optionals = {}) {
    const {objectType = 'personal', name, shortName, adminKey, subscriptionPlan, billingInterval} = optionals;
    const response = await new Router()
        .patch('/account', {
            body: {objectType, name, shortName, adminKey, subscriptionPlan, billingInterval},
        }).then(({body}) => body);
    return response;
}

export async function removeAccount(accountShortName) {
    return await new Router()
        .withAccountShortName(accountShortName)
        .delete('/account')
        .then(({body}) => body);
}

export async function forAdmin(
    adminKey: string,
    optionals: {
        includeAllMembers?: boolean,
        first?: number,
        max?: number
    } & GenericAdapterOptions = {},
): Promise<Account[]> {
    const {
        includeAllMembers, first, max,
        server,
    } = optionals;
    const searchParams = {
        includeAllMembers, first, max
    };

    return await new Router()
        .withServer(server)
        .withAccountShortName("epicenter")
        .withProjectShortName("manager")
        .withSearchParams(searchParams)
        .get(`/account/team/for/${adminKey}`)
        .then(({body}) => body);
}