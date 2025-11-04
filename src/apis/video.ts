import type { GenericScope, Address, Permit } from '../utils/constants';
import type { RoutingOptions, Page } from '../utils/router';

import Router from '../utils/router';

export interface VideoReadOutView {
    videoKey: string;
    family: string;
    affiliate: Affiliate;
    status: 'INITIALIZED' | 'RECORDED' | 'PROCESSED';
    scope: GenericScope;
    permit: Permit;
    address: Address;
    contents: string[];
    reference: string;
    created: string;
    lastUpdated: string;
    expiration: string;
}

export const AFFILIATE = {
    VONAGE: 'VONAGE',
    DAILY: 'DAILY',
    DOMESTIC: 'DOMESTIC',
} as const;

export type Affiliate = (typeof AFFILIATE)[keyof typeof AFFILIATE];

export type ProcessingType = 'transcription';

export const MEDIA_FORMAT = {
    mp3: 'mp3',
    mp4: 'mp4',
    wav: 'wav',
    flac: 'flac',
    ogg: 'ogg',
    amr: 'amr',
    webm: 'webm',
} as const;

export type MediaFormat = (typeof MEDIA_FORMAT)[keyof typeof MEDIA_FORMAT];

export const LANGUAGE_CODE = {
    'af-ZA': 'af-ZA',
    'ar-AE': 'ar-AE',
    'ar-SA': 'ar-SA',
    'cy-GB': 'cy-GB',
    'da-DK': 'da-DK',
    'de-CH': 'de-CH',
    'de-DE': 'de-DE',
    'en-AB': 'en-AB',
    'en-AU': 'en-AU',
    'en-GB': 'en-GB',
    'en-IE': 'en-IE',
    'en-IN': 'en-IN',
    'en-US': 'en-US',
    'en-WL': 'en-WL',
    'es-ES': 'es-ES',
    'es-US': 'es-US',
    'fa-IR': 'fa-IR',
    'fr-CA': 'fr-CA',
    'fr-FR': 'fr-FR',
    'ga-IE': 'ga-IE',
    'gd-GB': 'gd-GB',
    'he-IL': 'he-IL',
    'hi-IN': 'hi-IN',
    'id-ID': 'id-ID',
    'it-IT': 'it-IT',
    'ja-JP': 'ja-JP',
    'ko-KR': 'ko-KR',
    'nl-NL': 'nl-NL',
    'pt-BR': 'pt-BR',
    'pt-PT': 'pt-PT',
    'ru-RU': 'ru-RU',
    'ta-IN': 'ta-IN',
    'te-IN': 'te-IN',
    'tr-TR': 'tr-TR',
    'zh-CN': 'zh-CN',
    'zh-TW': 'zh-TW',
    'th-TH': 'th-TH',
    'en-ZA': 'en-ZA',
    'en-NZ': 'en-NZ',
} as const;

export type LanguageCode = (typeof LANGUAGE_CODE)[keyof typeof LANGUAGE_CODE];

/**
 * Represents a video directory.
 * @deprecated Use VideoReadOutView instead. VideoDir is an alias for backward compatibility.
 */
export type VideoDir = VideoReadOutView;


/**
 * Retrieves a video URL by video key and file name
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/video/url/{VIDEO_KEY}/{FILE}`
 *
 * @example
 * import { videoAPI } from 'epicenter-libs';
 * const url = await videoAPI.getVideoURLByKey('recording.mp4', 'video-key-123');
 *
 * @param file          Name of the file to retrieve
 * @param videoKey      Video key identifier
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the video URL
 */
export async function getVideoURLByKey(
    file: string,
    videoKey: string,
    optionals: RoutingOptions = {},
): Promise<string> {
    return await new Router()
        .get(`/video/url/${videoKey}/${file}`, optionals)
        .then(({ body }) => body);
}


/**
 * Retrieves a video URL by scope, affiliate, family, and file name
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/video/url/with/{SCOPE_BOUNDARY}/{SCOPE_KEY}/{AFFILIATE}/{FAMILY}/{FILE}` or GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/video/url/with/{SCOPE_BOUNDARY}/{SCOPE_KEY}/{USER_KEY}/{AFFILIATE}/{FAMILY}/{FILE}`
 *
 * @example
 * import { videoAPI } from 'epicenter-libs';
 * const url = await videoAPI.getVideoURLWith(
 *     'recording.mp4',
 *     'my-family',
 *     'DAILY',
 *     { scopeBoundary: 'group', scopeKey: 'group-123' },
 * );
 *
 * @param file                      Name of the file to retrieve
 * @param family                    Family identifier for the video
 * @param affiliate                 Video service affiliate (VONAGE, DAILY, or DOMESTIC)
 * @param scope                     Scope associated with the video
 * @param scope.scopeBoundary       Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param scope.scopeKey            Scope key, a unique identifier tied to the scope
 * @param [scope.userKey]           Optional key to scope the video to a user
 * @param [optionals]               Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the video URL
 */
export async function getVideoURLWith(
    file: string,
    family: string,
    affiliate: Affiliate,
    scope: { userKey?: string } & GenericScope,
    optionals: RoutingOptions = {},
): Promise<string> {
    const { scopeBoundary, scopeKey, userKey } = scope;
    const userKeyURIComponent = userKey ? `/${userKey}` : '';
    return await new Router()
        .get(`/video/url/with/${scopeBoundary}/${scopeKey}${userKeyURIComponent}/${affiliate}/${family}/${file}`, optionals)
        .then(({ body }) => body);
}


/**
 * Retrieves a video directory by video key
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/video/url/{VIDEO_KEY}`
 *
 * @example
 * import { videoAPI } from 'epicenter-libs';
 * const dir = await videoAPI.getVideoDirectoryByKey('video-key-123');
 *
 * @param videoKey      Video key identifier
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the video directory information
 */
export async function getVideoDirectoryByKey(
    videoKey: string,
    optionals: RoutingOptions = {},
): Promise<VideoReadOutView> {
    return await new Router()
        .get(`/video/url/${videoKey}`, optionals)
        .then(({ body }) => body);
}


/**
 * Retrieves a video directory by scope, affiliate, and family
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/video/dir/with/{SCOPE_BOUNDARY}/{SCOPE_KEY}/{AFFILIATE}/{FAMILY}` or GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/video/dir/with/{SCOPE_BOUNDARY}/{SCOPE_KEY}/{USER_KEY}/{AFFILIATE}/{FAMILY}`
 *
 * @example
 * import { videoAPI } from 'epicenter-libs';
 * const dir = await videoAPI.getVideoDirectoryWith(
 *     'my-family',
 *     'DAILY',
 *     { scopeBoundary: 'group', scopeKey: 'group-123' },
 * );
 *
 * @param family                    Family identifier for the video
 * @param affiliate                 Video service affiliate (VONAGE, DAILY, or DOMESTIC)
 * @param scope                     Scope associated with the video
 * @param scope.scopeBoundary       Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param scope.scopeKey            Scope key, a unique identifier tied to the scope
 * @param [scope.userKey]           Optional key to scope the video to a user
 * @param [optionals]               Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the video directory information
 */
export async function getVideoDirectoryWith(
    family: string,
    affiliate: Affiliate,
    scope: { userKey?: string } & GenericScope,
    optionals: RoutingOptions = {},
): Promise<VideoReadOutView> {
    const { scopeBoundary, scopeKey, userKey } = scope;
    const userKeyURIComponent = userKey ? `/${userKey}` : '';
    return await new Router()
        .get(`/video/dir/with/${scopeBoundary}/${scopeKey}${userKeyURIComponent}/${affiliate}/${family}`, optionals)
        .then(({ body }) => body);
}


/**
 * Searches for videos
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/video/search`
 *
 * @example
 * import { videoAPI } from 'epicenter-libs';
 * const videos = await videoAPI.getVideoSearch();
 *
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to a page of videos
 */
export async function getVideoSearch(
    optionals: RoutingOptions = {},
): Promise<Page<VideoReadOutView>> {
    return await new Router()
        .get('/video/search', optionals)
        .then(({ body }) => body);
}


/**
 * Deletes a video by video key
 * Base URL: DELETE `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/video/{VIDEO_KEY}`
 *
 * @example
 * import { videoAPI } from 'epicenter-libs';
 * await videoAPI.deleteVideoByKey('video-key-123');
 *
 * @param videoKey      Video key identifier
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves when the video is deleted
 */
export async function deleteVideoByKey(
    videoKey: string,
    optionals: RoutingOptions = {},
): Promise<void> {
    return await new Router()
        .delete(`/video/${videoKey}`, optionals)
        .then(({ body }) => body);
}


/**
 * Processes a video with specified processors (e.g., transcription)
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/video/execute/{VIDEO_KEY}`
 *
 * @example
 * import { videoAPI } from 'epicenter-libs';
 * await videoAPI.postVideoProcessor('video-key-123', {
 *     processors: [{
 *         mediaFormat: 'mp4',
 *         languageCode: 'en-US',
 *         objectType: 'transcription',
 *     }],
 * });
 *
 * @param videoKey                              Video key identifier
 * @param body                                  Processing configuration
 * @param body.processors                       Array of processor configurations
 * @param [body.processors[].jobName]           Optional name for the processing job
 * @param body.processors[].mediaFormat         Media format (mp3, mp4, wav, etc.)
 * @param body.processors[].languageCode        Language code for processing (e.g., 'en-US')
 * @param [body.processors[].timeoutMinutes]    Optional timeout in minutes
 * @param [body.processors[].mediaFile]         Optional specific media file to process
 * @param body.processors[].objectType          Processing type (currently 'transcription')
 * @param [body.log]                            Optional log information
 * @param [optionals]                           Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to true if processing started successfully
 */
export async function postVideoProcessor(
    videoKey: string,
    body: {
        processors: {
            jobName?: string;
            mediaFormat: MediaFormat;
            languageCode: LanguageCode;
            timeoutMinutes?: number;
            mediaFile?: string;
            objectType: ProcessingType;
        }[];
        log?: string;
    },
    optionals: RoutingOptions = {},
): Promise<boolean> {
    return await new Router()
        .post(`/video/execute/${videoKey}`, { body, ...optionals })
        .then(({ body }) => body);
}


/**
 * Downloads a video file by video key and file name
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/video/download/{VIDEO_KEY}/{FILE}`
 *
 * @example
 * import { videoAPI } from 'epicenter-libs';
 * await videoAPI.downloadVideoByKey('recording.mp4', 'video-key-123');
 *
 * @param file          Name of the file to download
 * @param videoKey      Video key identifier
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves when the download completes
 */
export async function downloadVideoByKey(
    file: string,
    videoKey: string,
    optionals: RoutingOptions = {},
): Promise<void> {
    return await new Router()
        .get(`/video/download/${videoKey}/${file}`, optionals)
        .then(({ body }) => body);
}


/**
 * Downloads a video file by scope, affiliate, family, and file name
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/video/download/with/{SCOPE_BOUNDARY}/{SCOPE_KEY}/{AFFILIATE}/{FAMILY}/{FILE}` or GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/video/download/with/{SCOPE_BOUNDARY}/{SCOPE_KEY}/{USER_KEY}/{AFFILIATE}/{FAMILY}/{FILE}`
 *
 * @example
 * import { videoAPI } from 'epicenter-libs';
 * await videoAPI.downloadVideoWith(
 *     'recording.mp4',
 *     'my-family',
 *     'DAILY',
 *     { scopeBoundary: 'group', scopeKey: 'group-123' },
 * );
 *
 * @param file                      Name of the file to download
 * @param family                    Family identifier for the video
 * @param affiliate                 Video service affiliate (VONAGE, DAILY, or DOMESTIC)
 * @param scope                     Scope associated with the video
 * @param scope.scopeBoundary       Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param scope.scopeKey            Scope key, a unique identifier tied to the scope
 * @param [scope.userKey]           Optional key to scope the video to a user
 * @param [optionals]               Optional arguments; pass network call options overrides here.
 * @returns promise that resolves when the download completes
 */
export async function downloadVideoWith(
    file: string,
    family: string,
    affiliate: Affiliate,
    scope: { userKey?: string } & GenericScope,
    optionals: RoutingOptions = {},
): Promise<void> {
    const { scopeBoundary, scopeKey, userKey } = scope;
    const userKeyURIComponent = userKey ? `/${userKey}` : '';
    return await new Router()
        .get(`/video/download/with/${scopeBoundary}/${scopeKey}${userKeyURIComponent}/${affiliate}/${family}/${file}`, optionals)
        .then(({ body }) => body);
}
