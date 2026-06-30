import type { RoutingOptions } from '../utils/router';

import { Router } from '../utils';

export type NotificationType = 'MARKETING' | 'SYSTEM';

export interface NotificationPreferenceCreateInView {
    notificationType?: NotificationType;
    adminKey?: string;
    notify?: boolean;
}

export interface NotificationPreferenceReadOutView {
    notificationType?: NotificationType;
    ownerKey?: string;
    notify?: boolean;
}


/**
 * Sets a notification preference
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/notification/preference`
 *
 * @example
 * import { notificationAdapter } from 'epicenter-libs';
 * await notificationAdapter.setPreference({
 *     notificationType: 'MARKETING',
 *     adminKey: 'my-admin-key',
 *     notify: false,
 * });
 *
 * @param preference                        Notification preference to set
 * @param [preference.notificationType]     Type of notification (MARKETING or SYSTEM)
 * @param [preference.adminKey]             Admin key for the preference
 * @param [preference.notify]               Whether to send notifications
 * @param [optionals]                       Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to undefined if successful
 */
export async function setPreference(
    preference: NotificationPreferenceCreateInView,
    optionals: RoutingOptions = {},
): Promise<void> {
    return await new Router()
        .post('/notification/preference', {
            body: preference,
            ...optionals,
        })
        .then(({ body }) => body);
}


/**
 * Gets notification preferences for a given admin key
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/notification/preference/{ADMIN_KEY}`
 *
 * @example
 * import { notificationAdapter } from 'epicenter-libs';
 * const preferences = await notificationAdapter.getPreferences('my-admin-key');
 *
 * @param adminKey      Admin key to retrieve preferences for
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to a list of notification preferences
 */
export async function getPreferences(
    adminKey: string,
    optionals: RoutingOptions = {},
): Promise<NotificationPreferenceReadOutView[]> {
    return await new Router()
        .get(`/notification/preference/${adminKey}`, {
            ...optionals,
        })
        .then(({ body }) => body);
}


/**
 * Opts out of all notification types using an opt-out token
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/notification/optout/{OPT_OUT_TOKEN}`
 *
 * @example
 * import { notificationAdapter } from 'epicenter-libs';
 * await notificationAdapter.optOut('my-opt-out-token');
 *
 * @param optOutToken   Token used to opt out of notifications
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the opt-out result
 */
export async function optOut(
    optOutToken: string,
    optionals: RoutingOptions = {},
): Promise<object> {
    return await new Router()
        .get(`/notification/optout/${optOutToken}`, {
            ...optionals,
        })
        .then(({ body }) => body);
}


/**
 * Opts out of a specific notification type using an opt-out token
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/notification/optout/{NOTIFICATION_TYPE}/{OPT_OUT_TOKEN}`
 *
 * @example
 * import { notificationAdapter } from 'epicenter-libs';
 * await notificationAdapter.optOutByType('MARKETING', 'my-opt-out-token');
 *
 * @param notificationType  Type of notification to opt out of (MARKETING or SYSTEM)
 * @param optOutToken       Token used to opt out of notifications
 * @param [optionals]       Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the opt-out result
 */
export async function optOutByType(
    notificationType: NotificationType,
    optOutToken: string,
    optionals: RoutingOptions = {},
): Promise<object> {
    return await new Router()
        .get(`/notification/optout/${notificationType}/${optOutToken}`, {
            ...optionals,
        })
        .then(({ body }) => body);
}
