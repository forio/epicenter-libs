import type { RoutingOptions } from '../utils/router';

import { Router } from '../utils';

export type DashboardVersion = 'V1';

export type PopType = 'first' | 'last' | 'all';

export interface Pop {
    objectType: PopType;
    value?: object;
}

export interface Items {
    set?: Record<string, object> | null;
    push?: Record<string, object> | null;
    inc?: Record<string, number> | null;
    pop?: Record<string, Pop> | null;
}

export interface DashboardPreferenceReadOutView {
    projectKey: string | null;
    adminKey: string | null;
    items: Record<string, unknown>;
    version: DashboardVersion | null;
    changed: boolean | null;
}


/**
 * Gets a dashboard preference by admin key.
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/dashboard/preference/{VERSION}/{ADMIN_KEY}`
 *
 * @example
 * import { dashboardAdapter } from 'epicenter-libs';
 * const preference = await dashboardAdapter.get('my-admin-key');
 *
 * @param adminKey        The admin key identifying the preference
 * @param [optionals]     Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.version]  The dashboard version; defaults to 'V1'
 * @returns promise that resolves to the dashboard preference
 */
export async function get(
    adminKey: string,
    optionals: {
        version?: DashboardVersion;
    } & RoutingOptions = {},
): Promise<DashboardPreferenceReadOutView> {
    const { version = 'V1', ...routingOptions } = optionals;
    return await new Router()
        .get(`/dashboard/preference/${version}/${adminKey}`, routingOptions)
        .then(({ body }) => body);
}


/**
 * Creates a dashboard preference with an admin key.
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/dashboard/preference/{VERSION}/{ADMIN_KEY}`
 *
 * @example
 * import { dashboardAdapter } from 'epicenter-libs';
 * const preference = await dashboardAdapter.create('my-admin-key', {
 *     items: { set: { theme: { dark: true } } },
 * });
 *
 * @param adminKey        The admin key identifying the preference
 * @param [optionals]     Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.items]    Items to set on the preference
 * @param [optionals.version]  The dashboard version; defaults to 'V1'
 * @returns promise that resolves to the created dashboard preference
 */
export async function create(
    adminKey: string,
    optionals: {
        items?: Items;
        version?: DashboardVersion;
    } & RoutingOptions = {},
): Promise<DashboardPreferenceReadOutView> {
    const { items, version = 'V1', ...routingOptions } = optionals;
    return await new Router()
        .post(`/dashboard/preference/${version}/${adminKey}`, {
            body: { items },
            ...routingOptions,
        }).then(({ body }) => body);
}


/**
 * Updates a dashboard preference by admin key using item operations (set, push, inc, pop).
 * Base URL: PUT `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/dashboard/preference/{VERSION}/{ADMIN_KEY}`
 *
 * @example
 * import { dashboardAdapter } from 'epicenter-libs';
 * const preference = await dashboardAdapter.update('my-admin-key', {
 *     set: { theme: { dark: true } },
 *     inc: { viewCount: 1 },
 * });
 *
 * @param adminKey        The admin key identifying the preference
 * @param items           Item operations to apply (set, push, inc, pop)
 * @param [optionals]     Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.version]  The dashboard version; defaults to 'V1'
 * @returns promise that resolves to the updated dashboard preference
 */
export async function update(
    adminKey: string,
    items: Items,
    optionals: {
        version?: DashboardVersion;
    } & RoutingOptions = {},
): Promise<DashboardPreferenceReadOutView> {
    const { version = 'V1', ...routingOptions } = optionals;
    return await new Router()
        .put(`/dashboard/preference/${version}/${adminKey}`, {
            body: items,
            ...routingOptions,
        }).then(({ body }) => body);
}


/**
 * Deletes a dashboard preference by admin key.
 * Base URL: DELETE `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/dashboard/preference/{VERSION}/{ADMIN_KEY}`
 *
 * @example
 * import { dashboardAdapter } from 'epicenter-libs';
 * const preference = await dashboardAdapter.remove('my-admin-key');
 *
 * @param adminKey        The admin key identifying the preference
 * @param [optionals]     Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.version]  The dashboard version; defaults to 'V1'
 * @returns promise that resolves to the deleted dashboard preference
 */
export async function remove(
    adminKey: string,
    optionals: {
        version?: DashboardVersion;
    } & RoutingOptions = {},
): Promise<DashboardPreferenceReadOutView> {
    const { version = 'V1', ...routingOptions } = optionals;
    return await new Router()
        .delete(`/dashboard/preference/${version}/${adminKey}`, routingOptions)
        .then(({ body }) => body);
}


/**
 * Gets all dashboard preferences for a project.
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/dashboard/preference/{VERSION}`
 *
 * @example
 * import { dashboardAdapter } from 'epicenter-libs';
 * const preferences = await dashboardAdapter.getAll();
 *
 * @param [optionals]     Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.version]  The dashboard version; defaults to 'V1'
 * @returns promise that resolves to the dashboard preference
 */
export async function getAll(
    optionals: {
        version?: DashboardVersion;
    } & RoutingOptions = {},
): Promise<DashboardPreferenceReadOutView> {
    const { version = 'V1', ...routingOptions } = optionals;
    return await new Router()
        .get(`/dashboard/preference/${version}`, routingOptions)
        .then(({ body }) => body);
}


/**
 * Creates a dashboard preference without an admin key.
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/dashboard/preference/{VERSION}`
 *
 * @example
 * import { dashboardAdapter } from 'epicenter-libs';
 * const preference = await dashboardAdapter.createDefault({
 *     items: { set: { theme: { dark: true } } },
 * });
 *
 * @param [optionals]     Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.items]    Items to set on the preference
 * @param [optionals.version]  The dashboard version; defaults to 'V1'
 * @returns promise that resolves to the created dashboard preference
 */
export async function createDefault(
    optionals: {
        items?: Items;
        version?: DashboardVersion;
    } & RoutingOptions = {},
): Promise<DashboardPreferenceReadOutView> {
    const { items, version = 'V1', ...routingOptions } = optionals;
    return await new Router()
        .post(`/dashboard/preference/${version}`, {
            body: { items },
            ...routingOptions,
        }).then(({ body }) => body);
}


/**
 * Updates dashboard preferences for a project using item operations.
 * Base URL: PUT `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/dashboard/preference/{VERSION}`
 *
 * @example
 * import { dashboardAdapter } from 'epicenter-libs';
 * const preference = await dashboardAdapter.updateAll({
 *     set: { theme: { dark: true } },
 * });
 *
 * @param items           Item operations to apply (set, push, inc, pop)
 * @param [optionals]     Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.version]  The dashboard version; defaults to 'V1'
 * @returns promise that resolves to the updated dashboard preference
 */
export async function updateAll(
    items: Items,
    optionals: {
        version?: DashboardVersion;
    } & RoutingOptions = {},
): Promise<DashboardPreferenceReadOutView> {
    const { version = 'V1', ...routingOptions } = optionals;
    return await new Router()
        .put(`/dashboard/preference/${version}`, {
            body: items,
            ...routingOptions,
        }).then(({ body }) => body);
}


/**
 * Deletes all dashboard preferences for a project.
 * Base URL: DELETE `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/dashboard/preference/{VERSION}`
 *
 * @example
 * import { dashboardAdapter } from 'epicenter-libs';
 * const preference = await dashboardAdapter.removeAll();
 *
 * @param [optionals]     Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.version]  The dashboard version; defaults to 'V1'
 * @returns promise that resolves to the deleted dashboard preference
 */
export async function removeAll(
    optionals: {
        version?: DashboardVersion;
    } & RoutingOptions = {},
): Promise<DashboardPreferenceReadOutView> {
    const { version = 'V1', ...routingOptions } = optionals;
    return await new Router()
        .delete(`/dashboard/preference/${version}`, routingOptions)
        .then(({ body }) => body);
}
