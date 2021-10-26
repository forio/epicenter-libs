import type { RoutingOptions } from '../utils/router';
import { ROLE, Router } from '../utils';

enum ACCESS_TYPE {
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE',
    AUTHENTICATED = 'AUTHENTICATED',
}

enum WORKER_PARTITION {
    NONE = 'NONE',
    ALL = 'ALL',
    FREE = 'FREE',
    LICENSED = 'LICENSED',
    ACCOUNT = 'ACCOUNT',
}

enum PHYLOGENY {
    ORIGINAL = 'ORIGINAL',
    HISTORICAL = 'HISTORICAL',
    REFERENTIAL = 'REFERENTIAL',
    ORDERED = 'ORDERED',
    EVENTUAL = 'EVENTUAL',
}

enum FILE_TYPE {
    INSENSITIVE = 'INSENSITIVE',
    SENSITIVE = 'SENSITIVE',
}

interface Member {
    role: ROLE.AUTHOR,
    adminKey: string,
    objectType: 'project',
}

interface Deployment {
    defaultGroupName: string,
    autoCreatePlayer: boolean,
    loginFile: string,
    welcomeFile: string,
    groupFile: string,
}

interface TeamProject {
    concurrentRunLimit: number,
    modelFile: string,
    available: boolean,
    allowWorldSelfAssign: boolean,
    legacySettings: {
        blockDirectApiCalls: boolean,
        channelAuthorizationRequired: boolean,
        filePermissionsActive: boolean,
        showEmail: boolean,
        transmogrifierActive: boolean,
        dataApiAllowAnonymousAccess: boolean,
        channelVersion: number,
        authorizationMode: 'LEGACY' | 'USER',
        dataApiEnforceScope: boolean,
    },
    objectType: 'team',
    accessType: keyof typeof ACCESS_TYPE,
    sessionTimeoutSeconds: number,
    projectKey: string,
    members: Member[],
    channelEnabled: boolean,
    workerPartition: keyof typeof WORKER_PARTITION,
    name: string,
    phylogeny: keyof typeof PHYLOGENY,
    multiPlayerEnabled: boolean,
    shortName: string,
    approximateRunCount: number,
    pricing: {
        amount: number,
    },
    dataRetentionDays: number,
    fileType: keyof typeof FILE_TYPE,
    dimensions: 'UNIVERSE' | 'MULTIVERSE',
    deployment: Deployment,
}

interface PersonalProject {
    concurrentRunLimit: number,
    available: boolean,
    objectType: 'personal',
    accessType: keyof typeof ACCESS_TYPE,
    sessionTimeoutSeconds: number,
    projectKey: string,
    workerPartition: keyof typeof WORKER_PARTITION,
    name: string,
    phylogeny: keyof typeof PHYLOGENY,
    shortName: string,
    approximateRunCount: number,
    fileType: keyof typeof FILE_TYPE,
    deployment: Deployment,
}

type Project =
    | TeamProject
    | PersonalProject;


/**
 * Project API adapters -- project stuff TODO
 * @namespace projectAdapter
 */


/**
 * Makes a connection request to the cometd server; effectively marking the user as online; using [logout](#authAdapter-logout) will automatically disconnect for you.
 *
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/project/channel/isEnabled`
 *
 * @memberof projectAdapter
 * @example
 *
 * epicenter.projectAdapter.channelsEnabled()
 *
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {Promise}                               Promise resolving true/false whether or not the project supports the use of push channels
 */
export async function channelsEnabled(
    optionals: RoutingOptions = {}
): Promise<boolean> {
    return await new Router()
        .get('/project/channel/isEnabled', optionals)
        .then(({ body }) => body);
}

export async function get(
    optionals: RoutingOptions = {}
): Promise<Project> {
    return await new Router()
        .get('/project', optionals)
        .then(({ body }) => body);
}
