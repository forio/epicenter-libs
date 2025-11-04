import type { Page, RoutingOptions } from '../utils/router';
import type { GenericScope, GenericSearchOptions } from '../utils/constants';
import type { VideoReadOutView, Affiliate, ProcessingType, MediaFormat, LanguageCode } from '../apis/video';

import EpicenterError from '../utils/error';
import { parseFilterInput } from '../utils/filter-parser';
import * as videoAPI from '../apis/video';


/**
 * Deletes a video (and its associated files)
 * Base URL: DELETE `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/video/{VIDEO_KEY}`
 *
 * @example
 * import { videoAdapter } from 'epicenter-libs';
 * await videoAdapter.remove(videoKey);
 *
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
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/video/search`
 *
 * @example
 * import { videoAdapter } from 'epicenter-libs';
 * const videos = await videoAdapter.query({
 *      filter: [
 *          'affiliate=VONAGE',                     // searches for videos provided by the Vonage affiliate
 *          'episodeName=myEpisode',                // searches for videos tied to the episode with name 'myEpisode'
 *          'created>=2022-01-03T20:30:53.054Z',    // searches for videos created after Jan 3rd 2022
 *      ],
 *      sort: ['+video.created'],                   // sort all findings by the 'created' field (ascending)
 *      first: 0,
 *      max: 25,
 * });
 *
 * @param searchOptions Search options
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to a page of video objects
 */
export async function query(
    searchOptions: GenericSearchOptions,
    optionals: RoutingOptions = {},
): Promise<Page<VideoReadOutView>> {
    const { filter, sort = [], first, max } = searchOptions;

    const searchParams = {
        filter: parseFilterInput(filter),
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
 * Gets a URL for a video file
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/video/url/{VIDEO_KEY}/{FILE}` or GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/video/url/with/{SCOPE_BOUNDARY}/{SCOPE_KEY}/{AFFILIATE}/{FAMILY}/{FILE}`
 *
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
 * @returns promise that resolves to the URL string for the video file
 */
export async function getURL(
    file: string,
    optionals: {
        scope?: { userKey?: string } & GenericScope;
        affiliate?: Affiliate;
        family?: string;
        videoKey?: string;
    } & RoutingOptions = {},
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


/**
 * Gets a directory URL for a video file
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/video/url/{VIDEO_KEY}` or GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/video/dir/with/{SCOPE_BOUNDARY}/{SCOPE_KEY}/{AFFILIATE}/{FAMILY}`
 *
 * @example
 * import { videoAdapter } from 'epicenter-libs';
 *
 * // get using video key
 * videoAdapter.getDirectoryURL({
 *      videoKey: '0000017e31bb902cfe17615867d5005c5d5f',
 * });
 *
 * // get using scope/affiliate/family
 * videoAdapter.getDirectoryURL({
 *      scope: {
 *          scopeBoundary: SCOPE_BOUNDARY.GROUP,
 *          scopeKey: session.groupKey,
 *      },
 *      affiliate: 'VONAGE',
 *      family: 'archiveName'
 * });
 *
 * @param [optionals]                       Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.scope]                 Scope object
 * @param [optionals.scope.scopeBoundary]   Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param [optionals.scope.scopeKey]        Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param [optionals.scope.userKey]         User attached to scope if necessary
 * @param [optionals.affiliate]             Affiliate -- only support for one for now: Vonage
 * @param [optionals.family]                Identifier for the resourced provided by the affiliate (in the case of Vonage, this is the archive name).
 * @param [optionals.videoKey]              Key for the video object
 * @returns promise that resolves to a video directory object containing file list and metadata
 */
export async function getDirectoryURL(
    optionals: {
        scope?: { userKey?: string } & GenericScope;
        affiliate?: Affiliate;
        family?: string;
        videoKey?: string;
    } & RoutingOptions = {},
): Promise<VideoReadOutView> {
    const { scope, affiliate, family, videoKey, ...routingOptions } = optionals;
    if (scope && family && affiliate) {
        return videoAPI.getVideoDirectoryWith(family, affiliate, scope, routingOptions);
    }
    if (videoKey) {
        return videoAPI.getVideoDirectoryByKey(videoKey, routingOptions);
    }
    throw new EpicenterError('Cannot get video URL -- either a video key or scope/affiliate/family specification is required.');
}


/**
 * Processes a video (one example of this is transcribing a video)
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/video/execute/{VIDEO_KEY}`
 *
 * @example
 *  const processors = [
 *      {
 *          mediaFormat: 'mp4',
 *          languageCode: 'en-US',
 *          objectType: 'transcription',
 *          mediaFile: 'archive.mp4',
 *          jobName: 'test-transcription',
 *      },
 *  ];
 *  await videoAdapter.processVideo(videoKey, processors);
 *
 * @param videoKey                              Video key
 * @param [processors[]]                        List of processes to complete
 * @param [processors[].jobName]                A string to specify the title of the newly file
 * @param [processors[].mediaFormat]            The format of the file you are processing
 * @param [processors[].languageCode]           The language which the video is recorded in
 * @param [processors[].timeoutMinutes]         Optional- how long to wait before the call cancels out; defaults to 3 minutes
 * @param [processors[].mediaFile]              The name of the media file to perform the process on
 * @param [processors[].objectType]             The type of processing job to perform (currently limited to transcribe)
 * @param [optionals]                           Optional arguments; pass network call options overrides here.
 * @param [optionals.log]                       Name for log file
 * @returns promise that resolves to a boolean indicating success
 */
export async function processVideo(
    videoKey: string,
    processors: {
        jobName: string;
        mediaFormat: MediaFormat;
        languageCode: LanguageCode;
        timeoutMinutes?: number;
        mediaFile: string;
        objectType: ProcessingType;
    }[],
    optionals: {
        log?: string;
    } & RoutingOptions = {},
): Promise<boolean> {
    const { log, ...routingOptions } = optionals;
    const body = {
        processors,
        log,
    };
    return videoAPI.postVideoProcessor(videoKey, body, routingOptions);
}


/**
 * Downloads a video file
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/video/download/{VIDEO_KEY}/{FILE}` or GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/video/download/with/{SCOPE_BOUNDARY}/{SCOPE_KEY}/{AFFILIATE}/{FAMILY}/{FILE}`
 *
 * @example
 * import { videoAdapter } from 'epicenter-libs';
 * // download using video key
 * await videoAdapter.download('archive.mp4', {
 *      videoKey: '0000017e31bb902cfe17615867d5005c5d5f',
 * });
 * // download using scope/affiliate/family
 * await videoAdapter.download('archive.mp4', {
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
 * @returns promise that resolves to undefined when download is complete
 */
export async function download(
    file: string,
    optionals: {
        scope?: { userKey?: string } & GenericScope;
        affiliate?: Affiliate;
        family?: string;
        videoKey?: string;
    } & RoutingOptions = {},
): Promise<void> {
    const { scope, affiliate, family, videoKey, ...routingOptions } = optionals;
    if (scope && family && affiliate) {
        return videoAPI.downloadVideoWith(file, family, affiliate, scope, routingOptions);
    }
    if (videoKey) {
        return videoAPI.downloadVideoByKey(file, videoKey, routingOptions);
    }
    throw new EpicenterError('Cannot download video -- either a video key or scope/affiliate/family specification is required.');
}
