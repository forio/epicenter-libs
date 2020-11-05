import { Router } from 'utils';

/**
 * Account API adapters -- account stuff TODO
 * @namespace accountAdapter
 */

export async function createAccount(optionals = {}) {
    const { objectType = 'personal', name, shortName, adminKey, subscriptionPlan, billingInterval } = optionals;
    const response = await new Router()
        .post('/account', {
            body: { objectType, name, shortName, adminKey, subscriptionPlan, billingInterval },
        }).then(({ body }) => body);
    return response;
}

// TODO -- just a copy-paste of create ATM; need to figuure out how to actually use
export async function updateAccount(optionals = {}) {
    const { objectType = 'personal', name, shortName, adminKey, subscriptionPlan, billingInterval } = optionals;
    const response = await new Router()
        .patch('/account', {
            body: { objectType, name, shortName, adminKey, subscriptionPlan, billingInterval },
        }).then(({ body }) => body);
    return response;
}

export async function removeAccount(accountShortName) {
    return await new Router()
        .withAccountShortName(accountShortName)
        .delete('/account')
        .then(({ body }) => body);
}