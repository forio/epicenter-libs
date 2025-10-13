import type { GenericScope } from '../utils/constants';
import type { RoutingOptions, Page } from '../utils/router';

import Router from '../utils/router';

export type Video = FIXME;
export enum AFFILIATE {
    VONAGE = 'VONAGE',
    DAILY = 'DAILY',
    DOMESTIC = 'DOMESTIC',
}

export enum PROCESSING_TYPE {
    transcription = 'transcription',
}

export enum MEDIA_FORMAT {
    mp3 = 'mp3',
    mp4 = 'mp4',
    wav = 'wav',
    flac = 'flac',
    ogg = 'ogg',
    amr = 'amr',
    webm = 'webm',
}

export enum LANGUAGE_CODE {
    'af-ZA' = 'af-ZA',
    'ar-AE' = 'ar-AE',
    'ar-SA' = 'ar-SA',
    'cy-GB' = 'cy-GB',
    'da-DK' = 'da-DK',
    'de-CH' = 'de-CH',
    'de-DE' = 'de-DE',
    'en-AB' = 'en-AB',
    'en-AU' = 'en-AU',
    'en-GB' = 'en-GB',
    'en-IE' = 'en-IE',
    'en-IN' = 'en-IN',
    'en-US' = 'en-US',
    'en-WL' = 'en-WL',
    'es-ES' = 'es-ES',
    'es-US' = 'es-US',
    'fa-IR' = 'fa-IR',
    'fr-CA' = 'fr-CA',
    'fr-FR' = 'fr-FR',
    'ga-IE' = 'ga-IE',
    'gd-GB' = 'gd-GB',
    'he-IL' = 'he-IL',
    'hi-IN' = 'hi-IN',
    'id-ID' = 'id-ID',
    'it-IT' = 'it-IT',
    'ja-JP' = 'ja-JP',
    'ko-KR' = 'ko-KR',
    'nl-NL' = 'nl-NL',
    'pt-BR' = 'pt-BR',
    'pt-PT' = 'pt-PT',
    'ru-RU' = 'ru-RU',
    'ta-IN' = 'ta-IN',
    'te-IN' = 'te-IN',
    'tr-TR' = 'tr-TR',
    'zh-CN' = 'zh-CN',
    'zh-TW' = 'zh-TW',
    'th-TH' = 'th-TH',
    'en-ZA' = 'en-ZA',
    'en-NZ' = 'en-NZ',
}

export type VIDEO_DIR = {
    contents: string[],
    videoKey: string,
};

export async function getVideoURLByKey(
    file: string,
    videoKey: string,
    optionals: RoutingOptions = {},
): Promise<string> {
    return await new Router()
        .get(`/video/url/${videoKey}/${file}`, optionals)
        .then(({ body }) => body);
}

export async function getVideoURLWith(
    file: string,
    family: string,
    affiliate: keyof typeof AFFILIATE,
    scope: { userKey?: string } & GenericScope,
    optionals: RoutingOptions = {},
): Promise<string> {
    const { scopeBoundary, scopeKey, userKey } = scope;
    const userKeyURIComponent = userKey ? `/${userKey}` : '';
    return await new Router()
        .get(`/video/url/with/${scopeBoundary}/${scopeKey}${userKeyURIComponent}/${affiliate}/${family}/${file}`, optionals)
        .then(({ body }) => body);
}

export async function getVideoDirectoryByKey(
    videoKey: string,
    optionals: RoutingOptions = {},
): Promise<VIDEO_DIR> {
    return await new Router()
        .get(`/video/url/${videoKey}`, optionals)
        .then(({ body }) => body);
}

export async function getVideoDirectoryWith(
    family: string,
    affiliate: keyof typeof AFFILIATE,
    scope: { userKey?: string } & GenericScope,
    optionals: RoutingOptions = {},
): Promise<VIDEO_DIR> {
    const { scopeBoundary, scopeKey, userKey } = scope;
    const userKeyURIComponent = userKey ? `/${userKey}` : '';
    return await new Router()
        .get(`/video/dir/with/${scopeBoundary}/${scopeKey}${userKeyURIComponent}/${affiliate}/${family}`, optionals)
        .then(({ body }) => body);
}

export async function getVideoSearch(
    optionals: RoutingOptions = {},
): Promise<Page<Video>> {
    return await new Router()
        .get('/video/search', optionals)
        .then(({ body }) => body);
}

export async function deleteVideoByKey(
    videoKey: string,
    optionals: RoutingOptions = {},
): Promise<void> {
    return await new Router()
        .delete(`/video/${videoKey}`, optionals)
        .then(({ body }) => body);
}

export async function postVideoProcessor(
    videoKey: string,
    body: {
        processors: {
            jobName?: string,
            mediaFormat: keyof typeof MEDIA_FORMAT,
            languageCode: keyof typeof LANGUAGE_CODE,
            timeoutMinutes?: number,
            mediaFile?: string,
            objectType: keyof typeof PROCESSING_TYPE,
        }[],
        log?: string,
    },
    optionals: RoutingOptions = {},
): Promise<boolean> {
    return await new Router()
        .post(`/video/execute/${videoKey}`, { body, ...optionals })
        .then(({ body }) => body);
}

export async function downloadVideoByKey(
    file: string,
    videoKey: string,
    optionals: RoutingOptions = {},
): Promise<void> {
    return await new Router()
        .get(`/video/download/${videoKey}/${file}`, optionals)
        .then(({ body }) => body);
}

export async function downloadVideoWith(
    file: string,
    family: string,
    affiliate: keyof typeof AFFILIATE,
    scope: { userKey?: string } & GenericScope,
    optionals: RoutingOptions = {},
): Promise<void> {
    const { scopeBoundary, scopeKey, userKey } = scope;
    const userKeyURIComponent = userKey ? `/${userKey}` : '';
    return await new Router()
        .get(`/video/download/with/${scopeBoundary}/${scopeKey}${userKeyURIComponent}/${affiliate}/${family}/${file}`, optionals)
        .then(({ body }) => body);
}