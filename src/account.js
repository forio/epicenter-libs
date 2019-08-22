import Router from './router.js';

export async function createAccount(options) {
    const { objectType = 'personal', name, shortName, adminKey, subscriptionPlan, billingInterval } = options;
    const response = await new Router()
        .post('/account', {
            body: { objectType, name, shortName, adminKey, subscriptionPlan, billingInterval },
        });
    return response;
}

// TODO -- just a copy-paste of create ATM; need to figuure out how to actually use
export async function updateAccount(options) {
    const { objectType = 'personal', name, shortName, adminKey, subscriptionPlan, billingInterval } = options;
    const response = await new Router()
        .patch('/account', {
            body: { objectType, name, shortName, adminKey, subscriptionPlan, billingInterval },
        });
    return response;
}

export async function removeAccount(accountShortName) {
    return await new Router()
        .withAccountShortName(accountShortName)
        .delete('/account');
}