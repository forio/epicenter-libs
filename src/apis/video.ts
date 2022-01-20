import type { GenericScope } from '../utils/constants';
import type { RoutingOptions, Page } from '../utils/router';

import Router from '../utils/router';

export type Video = FIXME;
export enum AFFILIATE {
    VONAGE = 'VONAGE',
}

export async function getVideoURLByKey(
    file: string,
    videoKey: string,
    optionals: RoutingOptions = {}
): Promise<string> {
    return await new Router()
        .get(`/video/${videoKey}/${file}`, optionals)
        .then(({ body }) => body);
}

export async function getVideoURLWith(
    file: string,
    family: string,
    affiliate: keyof typeof AFFILIATE,
    scope: { userKey?: string } & GenericScope,
    optionals: RoutingOptions = {}
): Promise<string> {
    const { scopeBoundary, scopeKey, userKey } = scope;
    const userKeyURIComponent = userKey ? `/${userKey}` : '';
    return await new Router()
        .get(`/video/url/with/${scopeBoundary}/${scopeKey}${userKeyURIComponent}/${affiliate}/${family}/${file}`, optionals)
        .then(({ body }) => body);
}

export async function getVideoSearch(
    optionals: RoutingOptions = {}
): Promise<Page<Video>> {
    return await new Router()
        .get('/video/search', optionals)
        .then(({ body }) => body);
}

export async function deleteVideoByKey(
    videoKey: string,
    optionals: RoutingOptions = {}
): Promise<void> {
    return await new Router()
        .delete(`/video/${videoKey}`, optionals)
        .then(({ body }) => body);
}
