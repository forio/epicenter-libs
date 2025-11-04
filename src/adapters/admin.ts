import type { RoutingOptions } from '../utils/router';

import Router from '../utils/router';

export interface Secret {
    password: string;
}

export interface AdminCreateInView {
    [key: string]: unknown;
    handle: string;
    email: string;
    givenName?: string;
    familyName?: string;
    verified: true;
    active?: true;
}

export interface Admin {
    lastUpdated: string;
    lastLogin: string;
    created: string;
    familyName: string;
    givenName: string;
    verified: boolean;
    handle: string;
    active: boolean;
    adminKey: string;
    email: string;
    objectType: 'external' | 'native';
}

export interface NativeAdminCreateInView extends AdminCreateInView {
    objectType: 'native';
    secret: Secret;
}


/**
 * Creates a new admin user
 * Base URL: POST `https://forio.com/api/v3/epicenter/manager/admin`
 *
 * @example
 * import { adminAdapter } from 'epicenter-libs';
 * const admin = await adminAdapter.createAdmin({
 *     handle: 'admin@example.com',
 *     email: 'admin@example.com',
 *     givenName: 'Jane',
 *     familyName: 'Doe',
 *     verified: true,
 *     active: true,
 * });
 *
 * @param view                  Admin user information
 * @param view.handle           Handle for the admin user
 * @param view.email            Email address for the admin user
 * @param [view.givenName]      Admin user's given name
 * @param [view.familyName]     Admin user's family name
 * @param view.verified         Verification status; must be true
 * @param [view.active]         Active status; defaults to true if unset
 * @returns promise that resolves to the newly created admin user
 */
export async function createAdmin(
    view: {
        handle: string;
        email: string;
        givenName?: string;
        familyName?: string;
        verified: true;
        active?: true;
        [key: string]: unknown;
    },
): Promise<Admin> {
    return await new Router()
        .withAccountShortName('epicenter')
        .withProjectShortName('manager')
        .post('/admin', {
            body: view,
        }).then(({ body }) => body);
}


/**
 * Retrieves an admin user by handle
 * Base URL: GET `https://forio.com/api/v3/epicenter/manager/admin/with/{HANDLE}`
 *
 * @example
 * import { adminAdapter } from 'epicenter-libs';
 * const admin = await adminAdapter.getWithHandle('admin@example.com');
 *
 * @param handle        Handle for the admin user
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the admin user
 */
export async function getWithHandle(handle: string, optionals: RoutingOptions = {}): Promise<Admin> {
    return await new Router()
        .withAccountShortName('epicenter')
        .withProjectShortName('manager')
        .get(`/admin/with/${handle}`, optionals)
        .then(({ body }) => body);
}
