import type { RoutingOptions } from '../utils/router';

import {
    Router,
} from 'utils';
// POST /api/v3/{accountShortName}/{projectShortName}/consensus/{worldKey}/{name}/{stage}
// Authentication: PARTICIPANT

// Consumes
// application/json

// Produces
// application/json

// Parameters
// PATH accountShortName : TYPE { "type" : "string" }

// PATH projectShortName : TYPE { "type" : "string" }

// PATH worldKey : TYPE { "type" : "string" }

// PATH name : TYPE { "type" : "string" }

// PATH stage : TYPE { "type" : "string" }

// defaultActions: {
//     P1: [{ name: 'submitPlayer1', arguments: [1] }],
//     P2: [{ name: 'submitPlayer2', arguments: [2] }],
// },
// ttlSeconds: 10

export async function create(
    worldKey: string,
    name: string,
    stage: string,
    expectedRoles: string[],
    optionals: {
        defaultActions?: Record<string, unknown>,
        ttlSeconds?: number,
        transparent?: boolean,
    } & RoutingOptions = {}
): Promise<unknown> {
    const {
        ttlSeconds,
        defaultActions,
        transparent = false,
        ...routingOptions
    } = optionals;
    return await new Router()
        .post(`/consensus/${worldKey}/${name}/${stage}`, {
            body: {
                actions: defaultActions,
                expectedRoles,
                ttlSeconds,
                transparent,
            },
            ...routingOptions,
        })
        .then(({ body }) => body);
}

// PATCH /api/v3/{accountShortName}/{projectShortName}/consensus/actions/{worldKey}/{name}/{stage}
//To edit the actions for this user's role

// POST /api/v3/{accountShortName}/{projectShortName}/consensus/actions/{worldKey}/{name}/{stage}
// Submitting actions , "publish"

// DELETE /api/v3/{accountShortName}/{projectShortName}/consensus/actions/{worldKey}/{name}/{stage}
// Deletes anyone who has made the call