import type {RoutingOptions} from '../utils/router';
import Router from '../utils/router';

/**
 * Account API adapters -- account stuff TODO
 * @namespace accountAdapter
 */

interface AccountReadView {
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

interface AccountUpdateView {
    name: string;
    workerPartition: string,
    active: boolean
}

interface TeamAccountUpdateView extends AccountUpdateView {
    billingInterval: string
}

export async function getAccount(accountShortName: string): Promise<AccountReadView> {
    return await new Router()
        .withAccountShortName(accountShortName)
        .get('/account')
        .then(({body}) => body);
}

export async function createAccount(view: AccountCreateView): Promise<AccountReadView> {

    return await new Router()
        .withAccountShortName('epicenter')
        .withProjectShortName('manager')
        .post('/account', {
            body: view,
        }).then(({body}) => body);
}

export async function updateAccount(
    view: AccountUpdateView,
    optionals: RoutingOptions = {},
): Promise<AccountReadView> {
    return await new Router()
        .patch('/account', {
            body: view,
            ...optionals,
        }).then(({body}) => body);
}

export async function removeAccount(
    accountShortName: string
): Promise<void> {
    return await new Router()
        .withAccountShortName(accountShortName)
        .delete('/account')
        .then(({body}) => body);
}

export async function teamForAdmin(
    adminKey: string,
    optionals: {
        includeAllMembers?: boolean,
        filter?: string,
        first?: number,
        max?: number,
    } & RoutingOptions = {},
): Promise<AccountReadView[]> {
    const {
        includeAllMembers, filter, first, max,
        ...routingOptions
    } = optionals;
    const searchParams = {
        includeAllMembers, filter, first, max,
    };

    return await new Router()
        .withAccountShortName('epicenter')
        .withProjectShortName('manager')
        .withSearchParams(searchParams)
        .get(`/account/team/for/${adminKey}`, routingOptions)
        .then(({body}) => body);
}