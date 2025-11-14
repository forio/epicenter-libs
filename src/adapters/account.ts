import type { RoutingOptions } from '../utils/router';
import type { Admin } from './admin';
import type { Project } from './project';

import Router from '../utils/router';

type WorkerPartition = 'NONE' | 'ALL' | 'DEVELOPMENT' | 'FREE' | 'LICENSED' | 'ACCOUNT';

export interface SecretStrategyCreateInView {
    difficulty?: string;
    encryption?: string;
    expirationDays?: number;
    reuseHorizon?: number;
}

export interface DisplayNameStrategyCreateInView {
    displayNameGenerator: string;
    clearOnDeletion: boolean;
}

export interface RetentionPreferenceCreateInView {
    inactiveUserRetentionDays?: number;
    dataRetentionDays?: number;
}

export interface MultiFactorStrategyCreateInView {
    expirationDays: number;
    adminMultiFactorRequirement: string;
    userMultiFactorRequirement: string;
}

export interface SecretCreateInView {
    password?: string;
}

export interface AccountSettingCreateInView {
    allowProjectScopedModels?: boolean;
    concurrentRunLimit?: number;
    authenticatedProjectLimit?: number;
    maximumUsers?: number;
    allowMultiPlayer?: boolean;
}

export interface BillingInformationCreateInView {
    subscriptionPlan?: string;
    subscriptionExpiration?: string;
    billingInterval?: string;
}

export interface AccountLegacySettingsCreateInView {
    authorizationMode?: string;
}

export interface LockoutLimitsCreateInView {
    blackoutMinutes: number;
    adminAttempts: number;
    userAttempts: number;
}

export interface PersonalAccountCreateInView {
    objectType: 'personal';
    shortName: string;
    adminKey: string;
    name: string;
    workerPartition?: WorkerPartition;
    active?: boolean;
    sharedSecret?: string;
}

export interface TeamAccountCreateInView {
    objectType: 'team';
    shortName: string;
    adminKey: string;
    name: string;
    secretStrategy?: SecretStrategyCreateInView;
    displayNameStrategy?: DisplayNameStrategyCreateInView;
    allowDeletion?: boolean;
    retentionPreference?: RetentionPreferenceCreateInView;
    multiFactorStrategy?: MultiFactorStrategyCreateInView;
    active?: boolean;
    apiSecret?: SecretCreateInView;
    accountSetting?: AccountSettingCreateInView;
    billingInformation?: BillingInformationCreateInView;
    legacySettings?: AccountLegacySettingsCreateInView;
    workerPartition?: WorkerPartition;
    allowStrongFacilitators?: boolean;
    sharedSecret?: string;
    allowAmbiguousHandles?: boolean;
    lockoutLimits?: LockoutLimitsCreateInView;
}

export interface SecretStrategyReadOutView {
    difficulty?: string;
    encryption?: string;
    expirationDays?: number;
    reuseHorizon?: number;
}

export interface DisplayNameStrategyReadOutView {
    displayNameGenerator?: string;
    clearOnDeletion?: boolean;
}

export interface RetentionPreferenceReadOutView {
    inactiveUserRetentionDays?: number;
    dataRetentionDays?: number;
}

export interface BillingInformationReadOutView {
    subscriptionPlan?: string;
    subscriptionExpiration?: string;
    billingInterval?: string;
}

export interface MultiFactorStrategyReadOutView {
    expirationDays?: number;
    adminMultiFactorRequirement?: string;
    userMultiFactorRequirement?: string;
}

export interface AccountLegacySettingsReadOutView {
    authorizationMode?: string;
}

export interface AccountSettingReadOutView {
    allowProjectScopedModels?: boolean;
    concurrentRunLimit?: number;
    authenticatedProjectLimit?: number;
    maximumUsers?: number;
    allowMultiPlayer?: boolean;
}

export interface AccountPermissionReadOutView {
    objectType: 'account';
    role?: string;
    handle?: string;
    adminKey?: string;
}

export interface LogoReadOutView {
    imageType?: 'PNG' | 'JPG' | 'SVG';
}

export interface LockoutLimitsReadOutView {
    adminAttempts?: number;
    userAttempts?: number;
    blackoutMinutes?: number;
}

export interface PersonalAccountReadOutView {
    objectType: 'personal';
    shortName?: string;
    name?: string;
    workerPartition?: WorkerPartition;
    active?: boolean;
    admin?: Admin;
    projects?: Project[];
    tombstone?: string;
    created?: string;
    lastUpdated?: string;
}

export interface TeamAccountReadOutView {
    objectType: 'team';
    shortName?: string;
    name?: string;
    workerPartition?: WorkerPartition;
    secretStrategy?: SecretStrategyReadOutView;
    displayNameStrategy?: DisplayNameStrategyReadOutView;
    allowDeletion?: boolean;
    retentionPreference?: RetentionPreferenceReadOutView;
    multiFactorStrategy?: MultiFactorStrategyReadOutView;
    active?: boolean;
    accountSetting?: AccountSettingReadOutView;
    billingInformation?: BillingInformationReadOutView;
    legacySettings?: AccountLegacySettingsReadOutView;
    allowStrongFacilitators?: boolean;
    allowAmbiguousHandles?: boolean;
    lockoutLimits?: LockoutLimitsReadOutView;
    members?: AccountPermissionReadOutView[];
    logo?: LogoReadOutView;
    projects?: Project[];
    tombstone?: string;
    created?: string;
    lastUpdated?: string;
}

export type AccountReadOutView = PersonalAccountReadOutView | TeamAccountReadOutView;

export interface PersonalAccountUpdateInView {
    objectType: 'personal';
    name?: string;
    workerPartition?: WorkerPartition;
    active?: boolean;
}

export interface TeamAccountUpdateInView {
    objectType: 'team';
    name?: string;
    workerPartition?: WorkerPartition;
    active?: boolean;
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
 * // Create a team account with billing
 * const teamAccount = await accountAdapter.createAccount({
 *     objectType: 'team',
 *     adminKey: 'admin-key',
 *     name: 'Acme Corp',
 *     shortName: 'acme',
 *     billingInformation: {
 *         billingInterval: 'monthly',
 *         subscriptionPlan: 'standard',
 *     },
 * });
 *
 * @param view                                      Account creation information
 * @param view.objectType                           Account type; either 'personal' or 'team'
 * @param view.shortName                            Unique short name for account, used as part of URL
 * @param view.adminKey                             Admin key for the account
 * @param view.name                                 Descriptive name of account
 * @param [view.workerPartition]                    Defines location of model execution
 * @param [view.active]                             Determines if the account can be used
 * @param [view.sharedSecret]                       Optional shared secret for the account
 * @param [view.secretStrategy]                     Configuration related to account secrets (team only)
 * @param [view.displayNameStrategy]                Configuration related to user displayName (team only)
 * @param [view.allowDeletion]                      Determines if this account can be deleted (team only)
 * @param [view.retentionPreference]                Configuration related to data, user, group retention preferences (team only)
 * @param [view.multiFactorStrategy]                Configuration related to multifactor authentication (team only)
 * @param [view.apiSecret]                          Configuration related to API secret keys (team only)
 * @param [view.accountSetting]                     Configuration related to account usage limits and capabilities (team only)
 * @param [view.billingInformation]                 Subscription and billing configuration (team only)
 * @param [view.legacySettings]                     API settings used for compatibility with legacy accounts (team only)
 * @param [view.allowStrongFacilitators]            Determines if facilitators can update participants' identifying information (team only)
 * @param [view.allowAmbiguousHandles]              Determines if a handle can be reused for an admin and a user in this account (team only)
 * @param [view.lockoutLimits]                      Configuration related to failed login attempt limits (team only)
 * @returns promise that resolves to the newly created account
 */
export async function createAccount(
    view: PersonalAccountCreateInView | TeamAccountCreateInView,
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
 * @param [view.name]                   Updated descriptive name of account
 * @param [view.workerPartition]        Updated location of model execution
 * @param [view.active]                 Updated status determining if the account can be used
 * @param [view.billingInterval]        Updated billing interval (team only)
 * @param [optionals]                   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the updated account information
 */
export async function updateAccount(
    view: PersonalAccountUpdateInView | TeamAccountUpdateInView,
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
