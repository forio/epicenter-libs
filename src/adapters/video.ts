import type { Page, RoutingOptions } from '../utils/router';
import type { GenericScope, GenericSearchOptions } from '../utils/constants';
import type { Video, AFFILIATE } from '../apis/video';

import EpicenterError from '../utils/error';
import * as videoAPI from '../apis/video';


/**
 * Deletes a video (and it's associated files)
 * @param videoKey      Video key
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to undefined when successful
 */
export async function remove(
    videoKey: string,
    optionals: RoutingOptions = {},
): Promise<void> {
    return videoAPI.deleteVideoByKey(videoKey, optionals);
}

/**
 * Open search for video objects
 * @param searchOptions Search options
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to a page of video objects
 */
export async function query(
    searchOptions: GenericSearchOptions,
    optionals: RoutingOptions = {},
): Promise<Page<Video>> {
    const { filter = [], sort = [], first, max } = searchOptions;

    const searchParams = {
        filter: filter.join(';') || undefined,
        sort: sort.join(';') || undefined,
        first, max,
    };

    return videoAPI.getVideoSearch({
        query: searchParams,
        paginated: true,
        ...optionals,
    });
}


/**
 * @example
 * import { videoAdapter } from 'epicenter-libs';
 *
 * // get using video key
 * videoAdapter.getURL('archive.mp4', {
 *      videoKey: '0000017e31bb902cfe17615867d5005c5d5f',
 * });
 *
 * // get using scope/affiliate/family
 * videoAdapter.getURL('archive.mp4', {
 *      scope: {
 *          scopeBoundary: SCOPE_BOUNDARY.GROUP,
 *          scopeKey: session.groupKey,
 *      },
 *      affiliate: 'VONAGE',
 *      family: 'archiveName'
 * });
 *
 * @param file                              Name of the file
 * @param [optionals]                       Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.scope]                 Scope object
 * @param [optionals.scope.scopeBoundary]   Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param [optionals.scope.scopeKey]        Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param [optionals.scope.userKey]         User attached to scope if necessary
 * @param [optionals.affiliate]             Affiliate -- only support for one for now: Vonage
 * @param [optionals.family]                Identifier for the resourced provided by the affiliate (in the case of Vonage, this is the archive name).
 * @param [optionals.videoKey]              Key for the video object
 * @returns
 */
export async function getURL(
    file: string,
    optionals: {
        scope?: { userKey?: string } & GenericScope,
        affiliate?: keyof typeof AFFILIATE,
        family?: string,
        videoKey?: string,
    } & RoutingOptions = {}
): Promise<string> {
    const { scope, affiliate, family, videoKey, ...routingOptions } = optionals;
    if (scope && family && affiliate) {
        return videoAPI.getVideoURLWith(file, family, affiliate, scope, routingOptions);
    }
    if (videoKey) {
        return videoAPI.getVideoURLByKey(file, videoKey, routingOptions);
    }
    throw new EpicenterError('Cannot get video URL -- either a video key or scope/affiliate/family specification is required.');
}