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

export async function getWithHandle(handle: string, optionals: RoutingOptions = {}) {
    return await new Router()
        .withAccountShortName('epicenter')
        .withProjectShortName('manager')
        .get(`/admin/with/${handle}`, optionals)
        .then(({ body }) => body);
}
