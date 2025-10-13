import type { RoutingOptions } from '../utils/router';
import { ROLE, Router } from '../utils';

export enum ACCESS_TYPE {
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE',
    AUTHENTICATED = 'AUTHENTICATED',
}

export enum WORKER_PARTITION {
    NONE = 'NONE',
    ALL = 'ALL',
    FREE = 'FREE',
    LICENSED = 'LICENSED',
    ACCOUNT = 'ACCOUNT',
}

export enum PHYLOGENY {
    ORIGINAL = 'ORIGINAL',
    HISTORICAL = 'HISTORICAL',
    REFERENTIAL = 'REFERENTIAL',
    ORDERED = 'ORDERED',
    EVENTUAL = 'EVENTUAL',
    /**
     * TRANSMOGRIFIED Improves the way Epicenter runs proxies.
     * @constant
     * @type {string}
     */
    TRANSMOGRIFIED = 'TRANSMOGRIFIED',
    /**
     * REANIMATED Changes the default run start-up ritual.
     * @constant
     * @type {string}
     */
    REANIMATED = 'REANIMATED',
    /**
     * SILENT Inhibits push channel notifications unless allowChannel is true, which by default is false.
     * @constant
     * @type {string}
     */
    SILENT = 'SILENT',
}

export enum FILE_TYPE {
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
    channelProtocol: 'OUMUAMUA' | 'COMETD',
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
    channelProtocol: 'OUMUAMUA' | 'COMETD',
    channelEnabled: boolean,
}

type Project =
    | TeamProject
    | PersonalProject;

/**
 * Checks to see if the project currently has the push channels enabled
 * @example
 * epicenter.projectAdapter.channelsEnabled();
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise resolving true/false whether or not the project supports the use of push channels
 */
export async function channelsEnabled(
    optionals: RoutingOptions = {},
): Promise<boolean> {
    return await new Router()
        .get('/project/channel/isEnabled', optionals)
        .then(({ body }) => body);
}

export async function get(
    optionals: RoutingOptions = {},
): Promise<Project> {
    return await new Router()
        .get('/project', optionals)
        .then(({ body }) => body);
}

export async function list(
    accountShortName: string,
    optionals: RoutingOptions = {},
): Promise<Project[]> {
    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName('manager')
        .get('/project/in', optionals)
        .then(({body}) => body);
}
