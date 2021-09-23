import { Router } from 'utils/index';

/**
 * Account API adapters -- account stuff TODO
 * @namespace accountAdapter
 */

export async function createAccount(
    account: FIXME,
): Promise<FIXME> {
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
        }).then(({ body }) => body);
}

// TODO -- just a copy-paste of create adapter ATM; need to figuure out how to actually use
export async function updateAccount(
    account: FIXME,
): Promise<FIXME> {
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
        }).then(({ body }) => body);
}

export async function removeAccount(
    accountShortName: string
): Promise<void> {
    return await new Router()
        .withAccountShortName(accountShortName)
        .delete('/account')
        .then(({ body }) => body);
}