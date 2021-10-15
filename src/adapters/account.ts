import {Router} from 'utils/index';

/**
 * Account API adapters -- account stuff TODO
 * @namespace accountAdapter
 */

type Account = FIXME;

export async function createAccount(
    account: Account,
    optionals: RoutingOptions = {},
): Promise<Account> {
    const { objectType = 'personal', name, shortName, adminKey, subscriptionPlan, billingInterval } = account;
    return await new Router()
        .patch('/account', {
            body: {
                objectType,
                name,
                shortName,
                adminKey,
                subscriptionPlan,
                billingInterval,
            },
            ...optionals,
        }).then(({ body }) => body);
}

export async function updateAccount(
    account: Account,
    optionals: RoutingOptions = {},
): Promise<Account> {
    const { objectType = 'personal', name, shortName, adminKey, subscriptionPlan, billingInterval } = account;
    return await new Router()
        .patch('/account', {
            body: {
                objectType,
                name,
                shortName,
                adminKey,
                subscriptionPlan,
                billingInterval,
            },
            ...optionals,
        }).then(({ body }) => body);
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
): Promise<Account[]> {
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