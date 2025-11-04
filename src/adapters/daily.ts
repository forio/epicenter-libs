import type { RoutingOptions } from '../utils/router';
import type { GenericScope } from '../utils/constants';

import {
    Router,
    ROLE,
    Fault,
} from '../utils';
import * as videoAdapter from './video';

export type RecordingType = 'CLOUD';
export type Privacy = 'PRIVATE';
export type StreamType = 'HLS';

export interface DailyRoomResponseReadOutView {
    name: string;
    url: string;
}

export interface DailyMeetingTokenResponseReadOutView {
    token: string;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const randRange = (min: number, max: number) => {
    return min + Math.random() * (max - min);
};

/* eslint-disable no-magic-numbers */
const RETRY_RANGES = [
    [6_000, 10_000],
    [11_000, 20_000],
    [30_000, 45_000],
];
/* eslint-enable no-magic-numbers */

const RATE_LIMIT_REACHED = 429;
async function handleRateLimit<T>(
    requestFunction: () => Promise<T>,
    retryNumber = 0,
): Promise<T> {
    let response;
    try {
        response = await requestFunction();
    } catch (error) {
        if (error instanceof Fault && error.status === RATE_LIMIT_REACHED && retryNumber <= RETRY_RANGES.length) {
            const [min, max] = RETRY_RANGES[retryNumber];
            await sleep(randRange(min, max));
            response = await handleRateLimit(requestFunction, retryNumber + 1);
        } else {
            throw error;
        }
    }
    return response;
}


/**
 * Gets the daily configuration for the epicenter account. Requires Support auth
 *
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/daily/v1`
 *
 * @example
 * import { dailyAdapter } from 'epicenter-libs';
 * const config = await dailyAdapter.getConfig();
 *
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the daily object
 */
export async function getConfig(
    optionals: RoutingOptions = {},
    // TODO: investigate actual return type
): Promise<unknown> {
    return await new Router()
        .get('/daily/v1', optionals)
        .then(({ body }) => body);
}


/**
 * Creates a new daily meeting room
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/daily/v1/room`
 *
 * @example
 * import { dailyAdapter, SCOPE_BOUNDARY } from 'epicenter-libs';
 * const room = await dailyAdapter.createRoom({
 *      scopeBoundary: SCOPE_BOUNDARY.GROUP,
 *      scopeKey: '0000017dd3bf540e5ada5b1e058f08f20461'
 * });
 *
 * @param scope                                                     Scope associated with your room
 * @param scope.scopeBoundary                                       Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param scope.scopeKey                                            Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param [scope.userKey]                                           Optional key to scope the room to a user
 * @param [optionals]                                               Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.readLock]                                      Role allowed to read
 * @param [optionals.writeLock]                                     Role allowed to write
 * @param [optionals.ttlSeconds]                                    Life span of any recording made (how long before it is deleted); defaults to 604,800 (1 week), max of 31,536,000 (1 year)
 * @param [optionals.privacy]                                       Whether the room is private or not; currently can only be set to PRIVATE
 * @param [optionals.exp]                                           When the room will be deleted in epoch seconds. Defaults to 24 hours. Max of 24 hours.
 * @param [optionals.enable_recording]                              The type of Daily recording method to use. Only CLOUD is currently permitted.
 * @param [optionals.streaming_endpoints]                           Details for daily streaming features.
 * @param [optionals.streaming_endpoints.name]                      Name of the stream
 * @param [optionals.streaming_endpoints.type]                      Type of the stream; only HLS is currently permitted
 * @param [optionals.streaming_endpoints.hls_config]                Options for hls stream
 * @param [optionals.streaming_endpoints.hls_config.save_hls_recording]  Whether or not to record the hls stream
 * @param [optionals.streaming_endpoints.hls_config.storage]        Storage details for hls stream
 * @param [optionals.streaming_endpoints.hls_config.path]           S3 storage path
 * @param [optionals.streaming_endpoints.hls_config.bucket_region]  S3 bucket region
 * @param [optionals.streaming_endpoints.hls_config.assume_role_arn]  S3 role ARN for permission to alter S3 resources
 * @param [optionals.streaming_endpoints.hls_config.bucket_name]    S3 bucket name
 * @param [optionals.disableRateLimitHandling]                      Disable automatic rate limit retry handling
 * @returns promise that resolves to the newly created room details
 */
export async function createRoom(
    scope: { userKey?: string } & GenericScope,
    optionals: {
        readLock?: keyof typeof ROLE;
        writeLock?: keyof typeof ROLE;
        privacy?: Privacy;
        ttlSeconds?: number;
        exp?: number;
        enable_recording?: RecordingType;
        disableRateLimitHandling?: boolean;
        streaming_endpoints?: [{
            name: string;
            type: StreamType;
            hls_config: {
                storage: {
                    path: string;
                    bucket_region?: string;
                    assume_role_arn?: string;
                    bucket_name?: string;
                };
                save_hls_recording?: boolean;
            };
        }];
    } & RoutingOptions = {},
): Promise<DailyRoomResponseReadOutView> {
    const {
        readLock,
        writeLock,
        ttlSeconds,
        privacy,
        exp,
        enable_recording,
        streaming_endpoints,
        disableRateLimitHandling,
        ...routingOptions
    } = optionals;
    const { PARTICIPANT } = ROLE;
    const callAPI = async (): Promise<DailyRoomResponseReadOutView> => {
        return await new Router()
            .post(
                '/daily/v1/room',
                {
                    body: {
                        epicenter: {
                            ttlSeconds,
                            scope,
                            permit: {
                                readLock: readLock || PARTICIPANT,
                                writeLock: writeLock || PARTICIPANT,
                            },
                        },
                        properties: {
                            exp,
                            enable_recording,
                            streaming_endpoints,
                        },
                        privacy,
                    },
                    ...routingOptions,
                },
            )
            .then(({ body }) => body);
    };
    return handleRateLimit(callAPI, disableRateLimitHandling ? RETRY_RANGES.length + 1 : 0);
}


/**
 * Creates a token for a daily meeting room
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/daily/v1/meetingToken`
 *
 * @example
 * import { dailyAdapter } from 'epicenter-libs';
 * const token = await dailyAdapter.createToken('my-room-name');
 *
 * @param room_name                         Name of the room to create a token for
 * @param [optionals]                       Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.start_video_off]       Whether the user should have their video off upon joining the meeting; defaults to true.
 * @param [optionals.is_owner]              Whether the user has owner permissions; owner permissions are required to start a stream (not a recording); defaults to false
 * @param [optionals.user_name]             Username to display in daily's system. This is relevant if the daily call is open in a separate window
 * @param [optionals.close_tab_on_exit]     Whether to close the tab on the end of the call. This is relevant if the daily call is open in a separate window
 * @param [optionals.exp]                   When the token will be deleted in epoch seconds. Defaults to 24 hours. Max of 24 hours.
 * @param [optionals.enable_recording]      The type of Daily recording method to permit. Only CLOUD is currently permitted.
 * @param [optionals.disableRateLimitHandling]  Disable automatic rate limit retry handling
 * @param [optionals.selfSign]              Whether to self-sign the token; defaults to true
 * @returns promise that resolves to the newly created token details
 */
export async function createToken(
    room_name: string,
    optionals: {
        start_video_off?: boolean;
        is_owner?: boolean;
        user_name?: string;
        close_tab_on_exit?: boolean;
        exp?: number;
        enable_recording?: RecordingType;
        disableRateLimitHandling?: boolean;
        selfSign?: boolean;
    } & RoutingOptions = {},
): Promise<DailyMeetingTokenResponseReadOutView> {
    const {
        start_video_off,
        is_owner,
        user_name,
        close_tab_on_exit,
        exp,
        enable_recording,
        disableRateLimitHandling,
        selfSign = true,
        ...routingOptions
    } = optionals;
    const callAPI = async (): Promise<DailyMeetingTokenResponseReadOutView> => {
        return await new Router()
            .withSearchParams({ selfSign })
            .post(
                '/daily/v1/meetingToken',
                {
                    body: {
                        properties: {
                            room_name,
                            start_video_off,
                            is_owner,
                            user_name,
                            close_tab_on_exit,
                            exp,
                            enable_recording,
                        },
                    },
                    ...routingOptions,
                },
            )
            .then(({ body }) => body);
    };
    return handleRateLimit(callAPI, disableRateLimitHandling ? RETRY_RANGES.length + 1 : 0);
}


/**
 * Convenience function for retrieving the most recent recording for a Daily room
 *
 * @example
 * import { dailyAdapter, SCOPE_BOUNDARY } from 'epicenter-libs';
 * const videoUrl = await dailyAdapter.getVideoByRecordingId('my-room', 'recording_instance_id', {
 *     scopeBoundary: SCOPE_BOUNDARY.GROUP,
 *     scopeKey: 'GROUP_KEY'
 * });
 *
 * @param room_name         Name of the room
 * @param recordingId       Recording instance ID
 * @param scope             Scope associated with the room
 * @param scope.scopeBoundary   Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param scope.scopeKey    Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param [scope.userKey]   Optional key to scope the room to a user
 * @param [optionals]       Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to a url if a video exists or null if it does not
 */
export async function getVideoByRecordingId(
    room_name: string,
    recordingId: string,
    scope: { userKey?: string } & GenericScope,
    optionals: RoutingOptions = {},
): Promise<string | null> {
    const filePathInfo = await videoAdapter.getDirectoryURL({
        scope,
        affiliate: 'DAILY',
        family: room_name,
        ...optionals,
    });
    const filePaths = filePathInfo.contents;
    if (!filePaths?.length) return null;
    filePaths.sort((a, b) => Number(b.split('.')[0]) - Number(a.split('.')[0]));
    const filePath = filePaths.find((p) => p.includes(recordingId) && p.includes('.mp4'));
    if (!filePath) return null;
    return await videoAdapter.getURL(filePath, {
        scope,
        affiliate: 'DAILY',
        family: room_name,
        ...optionals,
    });
}


/**
 * Sets the daily family/room to a recording status of recorded; necessary to prevent videos from deleting automatically within 1 hour
 * Base URL: DELETE `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/daily/v1/meetingToken/{ROOM_NAME}`
 *
 * @example
 * import { dailyAdapter } from 'epicenter-libs';
 * const success = await dailyAdapter.updateRecordingStatus('my-room');
 *
 * @param room_name     Name of the room
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to true if successful
 */
export async function updateRecordingStatus(room_name: string,
    optionals: RoutingOptions = {},
): Promise<boolean> {
    return await new Router()
        .delete(`/daily/v1/meetingToken/${room_name}`, optionals)
        .then(({ body }) => body);
}
