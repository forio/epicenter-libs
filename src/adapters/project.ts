import type { RoutingOptions } from '../utils/router';
import { ROLE, Router } from '../utils';

export const ACCESS_TYPE = {
    PUBLIC: 'PUBLIC',
    PRIVATE: 'PRIVATE',
    AUTHENTICATED: 'AUTHENTICATED',
} as const;

export type AccessType = (typeof ACCESS_TYPE)[keyof typeof ACCESS_TYPE];

export const WORKER_PARTITION = {
    NONE: 'NONE',
    ALL: 'ALL',
    FREE: 'FREE',
    LICENSED: 'LICENSED',
    ACCOUNT: 'ACCOUNT',
} as const;

export type WorkerPartition = (typeof WORKER_PARTITION)[keyof typeof WORKER_PARTITION];

export const PHYLOGENY = {
    ORIGINAL: 'ORIGINAL',
    HISTORICAL: 'HISTORICAL',
    REFERENTIAL: 'REFERENTIAL',
    ORDERED: 'ORDERED',
    EVENTUAL: 'EVENTUAL',
    /**
     * TRANSMOGRIFIED Improves the way Epicenter runs proxies.
     */
    TRANSMOGRIFIED: 'TRANSMOGRIFIED',
    /**
     * REANIMATED Changes the default run start-up ritual.
     */
    REANIMATED: 'REANIMATED',
    /**
     * SILENT Inhibits push channel notifications unless allowChannel is true, which by default is false.
     */
    SILENT: 'SILENT',
} as const;

export type Phylogeny = (typeof PHYLOGENY)[keyof typeof PHYLOGENY];

export type FileType = 'INSENSITIVE' | 'SENSITIVE';

export const CHANNEL_PROTOCOL = {
    OUMUAMUA: 'OUMUAMUA',
    COMETD: 'COMETD',
} as const;

export type ChannelProtocol = (typeof CHANNEL_PROTOCOL)[keyof typeof CHANNEL_PROTOCOL];

export interface ProjectMember {
    role: ROLE.AUTHOR;
    adminKey: string;
    objectType: 'project';
}

export interface Deployment {
    defaultGroupName: string;
    autoCreatePlayer: boolean;
    loginFile: string;
    welcomeFile: string;
    groupFile: string;
}

export interface TeamProject {
    concurrentRunLimit: number;
    modelFile: string;
    available: boolean;
    allowWorldSelfAssign: boolean;
    legacySettings: {
        blockDirectApiCalls: boolean;
        channelAuthorizationRequired: boolean;
        filePermissionsActive: boolean;
        showEmail: boolean;
        transmogrifierActive: boolean;
        dataApiAllowAnonymousAccess: boolean;
        channelVersion: number;
        authorizationMode: 'LEGACY' | 'USER';
        dataApiEnforceScope: boolean;
    };
    objectType: 'team';
    accessType: AccessType;
    sessionTimeoutSeconds: number;
    projectKey: string;
    members: ProjectMember[];
    channelEnabled: boolean;
    workerPartition: WorkerPartition;
    name: string;
    phylogeny: Phylogeny;
    multiPlayerEnabled: boolean;
    shortName: string;
    approximateRunCount: number;
    pricing: {
        amount: number;
    };
    dataRetentionDays: number;
    fileType: FileType;
    dimensions: 'UNIVERSE' | 'MULTIVERSE';
    deployment: Deployment;
    channelProtocol: ChannelProtocol;
}

export interface PersonalProject {
    concurrentRunLimit: number;
    available: boolean;
    objectType: 'personal';
    accessType: AccessType;
    sessionTimeoutSeconds: number;
    projectKey: string;
    workerPartition: WorkerPartition;
    name: string;
    phylogeny: Phylogeny;
    shortName: string;
    approximateRunCount: number;
    fileType: FileType;
    deployment: Deployment;
    channelProtocol: ChannelProtocol;
    channelEnabled: boolean;
}

export type Project =
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
        .then(({ body }) => body);
}
