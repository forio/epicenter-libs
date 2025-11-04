import type { RoutingOptions } from '../utils/router';

import Router from '../utils/router';

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


/**
 * Retrieves account information by account short name
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/account`
 *
 * @example
 * import { accountAdapter } from 'epicenter-libs';
 * const account = await accountAdapter.getAccount('acme');
 *
 * @param accountShortName  The short name of the account to retrieve
 * @returns promise that resolves to the account information
 */
export async function getAccount(accountShortName: string): Promise<AccountReadOutView> {
    return await new Router()
        .withAccountShortName(accountShortName)
        .get('/account')
        .then(({ body }) => body);
}


/**
 * Creates a new personal or team account
 * Base URL: POST `https://forio.com/api/v3/epicenter/manager/account`
 *
 * @example
 * import { accountAdapter } from 'epicenter-libs';
 * // Create a personal account
 * const personalAccount = await accountAdapter.createAccount({
 *     objectType: 'personal',
 *     adminKey: 'admin-key',
 *     name: 'John Doe',
 *     shortName: 'johndoe',
 * });
 * // Create a team account
 * const teamAccount = await accountAdapter.createAccount({
 *     objectType: 'team',
 *     adminKey: 'admin-key',
 *     name: 'Acme Corp',
 *     shortName: 'acme',
 *     billingInterval: 'monthly',
 *     subscriptionPlan: 'standard',
 * });
 *
 * @param view                          Account information
 * @param view.objectType               Account type; either 'personal' or 'team'
 * @param view.adminKey                 Admin key for the account
 * @param view.name                     Display name for the account
 * @param view.shortName                Short name/identifier for the account
 * @param [view.sharedSecret]           Optional shared secret for the account
 * @param [view.workerPartition]        Optional worker partition for the account
 * @param [view.active]                 Optional active status; defaults to true
 * @param view.billingInterval          Billing interval for team accounts (e.g., 'monthly', 'annual')
 * @param view.subscriptionPlan         Subscription plan for team accounts
 * @returns promise that resolves to the newly created account
 */
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


/**
 * Updates an existing personal or team account
 * Base URL: PATCH `https://forio.com/api/v3/{ACCOUNT}/account`
 *
 * @example
 * import { accountAdapter } from 'epicenter-libs';
 * // Update a personal account
 * const updatedPersonal = await accountAdapter.updateAccount({
 *     objectType: 'personal',
 *     name: 'Jane Doe',
 *     active: true,
 * });
 * // Update a team account
 * const updatedTeam = await accountAdapter.updateAccount({
 *     objectType: 'team',
 *     name: 'Acme Corporation',
 *     billingInterval: 'annual',
 * });
 *
 * @param view                          Account update information
 * @param view.objectType               Account type; either 'personal' or 'team'
 * @param [view.name]                   Updated display name for the account
 * @param [view.workerPartition]        Updated worker partition for the account
 * @param [view.active]                 Updated active status
 * @param [view.billingInterval]        Updated billing interval for team accounts
 * @param [optionals]                   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the updated account information
 */
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


/**
 * Deletes an account by account short name
 * Base URL: DELETE `https://forio.com/api/v3/{ACCOUNT}/account`
 *
 * @example
 * import { accountAdapter } from 'epicenter-libs';
 * await accountAdapter.removeAccount('acme');
 *
 * @param accountShortName  The short name of the account to delete
 * @returns promise that resolves when the account is deleted
 */
export async function removeAccount(
    accountShortName: string,
): Promise<void> {
    return await new Router()
        .withAccountShortName(accountShortName)
        .delete('/account')
        .then(({ body }) => body);
}


/**
 * Retrieves all team accounts for a given admin user
 * Base URL: GET `https://forio.com/api/v3/epicenter/manager/account/team/for/{ADMIN_KEY}`
 *
 * @example
 * import { accountAdapter } from 'epicenter-libs';
 * const teams = await accountAdapter.teamForAdmin('admin-key-123', {
 *     includeAllMembers: true,
 *     filter: 'active',
 *     first: 0,
 *     max: 50,
 * });
 *
 * @param adminKey                          Admin key to retrieve teams for
 * @param [optionals]                       Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.includeAllMembers]     Include all members in the response
 * @param [optionals.filter]                Filter string for results
 * @param [optionals.first]                 Index of first result to return
 * @param [optionals.max]                   Maximum number of results to return
 * @returns promise that resolves to an array of team accounts
 */
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
        includeAllMembers,
        filter,
        first,
        max,
        ...routingOptions
    } = optionals;
    const searchParams = {
        includeAllMembers,
        filter,
        first,
        max,
    };

    return await new Router()
        .withAccountShortName('epicenter')
        .withProjectShortName('manager')
        .withSearchParams(searchParams)
        .get(`/account/team/for/${adminKey}`, routingOptions)
        .then(({ body }) => body);
}
