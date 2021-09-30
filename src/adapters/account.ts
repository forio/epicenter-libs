import {Router} from 'utils/index';

/**
 * Account API adapters -- account stuff TODO
 * @namespace accountAdapter
 */

interface Account {
    name: string;
    objectType: string;
}

interface AccountCreateView {
    adminKey: string;
    name: string;
    shortName: string;
    sharedSecret?: string;
    workerPartition?: string;
    active?: boolean;
}

interface PersonalAccountCreateView extends AccountCreateView {
    objectType: 'personal';
}

interface TeamAccountCreateView extends AccountCreateView {
    objectType: 'team';
    billingInterval: string;
    subscriptionPlan: string;
}

export async function createAccount(view: AccountCreateView) {

    return await new Router()
        .withAccountShortName('epicenter')
        .withProjectShortName('manager')
        .post('/account', {
            body: view,
        }).then(({body}) => body);
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

export async function getAccount(accountShortName) {
    return await new Router()
        .withAccountShortName(accountShortName)
        .get('/account')
        .then(({body}) => body);
}

export async function teamForAdmin(
    adminKey: string,
    optionals: {
        includeAllMembers?: boolean,
        filter?: string,
        first?: number,
        max?: number
    } & GenericAdapterOptions = {},
): Promise<Account[]> {
    const {
        includeAllMembers, filter, first, max,
        server,
    } = optionals;
    const searchParams = {
        includeAllMembers, filter, first, max,
    };

    return await new Router()
        .withServer(server)
        .withAccountShortName('epicenter')
        .withProjectShortName('manager')
        .withSearchParams(searchParams)
        .get(`/account/team/for/${adminKey}`)
        .then(({body}) => body);
}