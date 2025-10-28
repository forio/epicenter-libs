import type { RoutingOptions } from 'utils/router';

import Router from 'utils/router';

export interface AccountReadOutView {
    name: string;
    objectType: string;
}

export interface AccountCreateInView {
    adminKey: string;
    name: string;
    shortName: string;
    sharedSecret?: string;
    workerPartition?: string;
    active?: boolean;
}

export interface PersonalAccountCreateInView extends AccountCreateInView {
    objectType: 'personal';
}

export interface TeamAccountCreateInView extends AccountCreateInView {
    objectType: 'team';
    billingInterval: string;
    subscriptionPlan: string;
}

export interface AccountUpdateInView {
    name?: string;
    workerPartition?: string;
    active?: boolean;
}

export interface PersonalAccountUpdateInView extends AccountUpdateInView {
    objectType: 'personal';
}

export interface TeamAccountUpdateInView extends AccountUpdateInView {
    objectType: 'team';
    billingInterval?: string;
}

export async function getAccount(accountShortName: string): Promise<AccountReadOutView> {
    return await new Router()
        .withAccountShortName(accountShortName)
        .get('/account')
        .then(({ body }) => body);
}

export async function createAccount(
    view: {
        objectType: 'personal';
        adminKey: string;
        name: string;
        shortName: string;
        sharedSecret?: string;
        workerPartition?: string;
        active?: boolean;
    } | {
        objectType: 'team';
        adminKey: string;
        name: string;
        shortName: string;
        billingInterval: string;
        subscriptionPlan: string;
        sharedSecret?: string;
        workerPartition?: string;
        active?: boolean;
    },
): Promise<AccountReadOutView> {
    return await new Router()
        .withAccountShortName('epicenter')
        .withProjectShortName('manager')
        .post('/account', {
            body: view,
        }).then(({ body }) => body);
}

export async function updateAccount(
    view: {
        objectType: 'personal';
        name?: string;
        workerPartition?: string;
        active?: boolean;
    } | {
        objectType: 'team';
        name?: string;
        workerPartition?: string;
        active?: boolean;
        billingInterval?: string;
    },
    optionals: RoutingOptions = {},
): Promise<AccountReadOutView> {
    return await new Router()
        .patch('/account', {
            body: view,
            ...optionals,
        }).then(({ body }) => body);
}

export async function removeAccount(
    accountShortName: string,
): Promise<void> {
    return await new Router()
        .withAccountShortName(accountShortName)
        .delete('/account')
        .then(({ body }) => body);
}

export async function teamForAdmin(
    adminKey: string,
    optionals: {
        includeAllMembers?: boolean;
        filter?: string;
        first?: number;
        max?: number;
    } & RoutingOptions = {},
): Promise<AccountReadOutView[]> {
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
        .then(({ body }) => body);
}
