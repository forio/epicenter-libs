import type { RoutingOptions } from 'utils/router';
import { GROUP_ROLE } from 'utils/constants';
import Router from 'utils/router';

export type Modality = 'NONE' | 'HBP' | 'ICC' | 'SSO';
export type MFAMethodology = 'NONE' | 'NOOP' | 'TOTP';

// Generic type alias for SSO realm data
export type RealmData = Record<string, unknown>;

export interface MFADetailReadOutView {
    mfaMethodology: MFAMethodology;
}

export interface GraftReadOutView<R extends RealmData = RealmData> {
    reference: string;
    realm: R;
}

export interface Countdown {
    last?: string;
    count?: number;
}

export interface GroupRelationshipReadOutView {
    role: keyof typeof GROUP_ROLE;
}

export interface UserReadOutView {
    lastLogin: string;
    modality: Modality;
    lastUpdated: string;
    created: string;
    displayName: string;
    countdown?: Countdown;
    givenName: string;
    familyName: string;
    handle: string;
    loginCount: number;
    uploadOrder: number;
    email: string;
    active: boolean;
    userId: number;
    userKey: string;
    objectType: 'external' | 'native';
    mfaDetail: MFADetailReadOutView;
}

export interface ExternalUserReadOutView extends UserReadOutView {
    graft: GraftReadOutView;
    objectType: 'external';
}

export interface NativeUserReadOutView extends UserReadOutView {
    objectType: 'native';
}

export interface PseudonymReadOutView {
    lastUpdated: string;
    created: string;
    displayName: string;
    detail: ExternalUserReadOutView | NativeUserReadOutView;
    userId: number;
    userKey: string;
    relationship: GroupRelationshipReadOutView;
}

export interface MFADetailCreateInView {
    mfaMethodology: MFAMethodology;
    mfaKey?: string;
}

export interface GraftCreateInView<R extends RealmData = RealmData> {
    reference: string;
    realm: R;
}

export interface SecretCreateInView {
    password: string;
}

export interface UserCreateInView {
    handle: string;
    modality?: Modality;
    displayName?: string;
    familyName?: string;
    givenName?: string;
    countdown?: Countdown;
    active?: true;
    email?: string;
    mfaDetail?: MFADetailCreateInView;
}

export interface NativeUserCreateInView extends UserCreateInView {
    objectType: 'native';
    secret?: SecretCreateInView;
}

export interface ExternalUserCreateInView<R extends RealmData = RealmData> extends UserCreateInView {
    objectType: 'external';
    graft: GraftCreateInView<R>;
}

export interface UploadOptions extends RoutingOptions {
    groupKey?: string;
    overwrite?: boolean;
}

export interface DiscardedUser {
    user: ExternalUserReadOutView | NativeUserReadOutView;
    message: string;
    information: Record<string, unknown>;
    code: string;
}

export interface UserReport {
    duplicated?: PseudonymReadOutView[];
    created?: PseudonymReadOutView[];
    updated?: PseudonymReadOutView[];
    discarded?: DiscardedUser[];
}

export async function uploadCSV(
    file: File,
    optionals: UploadOptions = {},
): Promise<UserReport> {
    const {
        overwrite,
        ...routingOptions
    } = optionals;

    const formdata = new FormData();
    formdata.append('file', file);

    return await new Router()
        .withSearchParams({ overwrite })
        .post('/user/upload', {
            body: formdata,
            ...routingOptions,
        })
        .then(({ body }) => body);
}

/**
 * Create a new user (native or external).
 */
export async function createUser<R extends RealmData = RealmData>(
    view: {
        objectType: 'native';
        handle: string;
        modality?: Modality;
        displayName?: string;
        familyName?: string;
        givenName?: string;
        countdown?: Countdown;
        active?: true;
        email?: string;
        mfaDetail?: MFADetailCreateInView;
        secret?: SecretCreateInView;
    } | {
        objectType: 'external';
        handle: string;
        modality?: Modality;
        displayName?: string;
        familyName?: string;
        givenName?: string;
        countdown?: Countdown;
        active?: true;
        email?: string;
        mfaDetail?: MFADetailCreateInView;
        graft: GraftCreateInView<R>;
    },
    optionals: RoutingOptions = {},
): Promise<PseudonymReadOutView> {
    return await new Router()
        .post('/user', {
            body: view,
            ...optionals,
        })
        .then(({ body }) => body);
}

/**
 * Gets a specific user.
 * @example
 * epicenter.userAdapter.get('00000179b4d3fb0c84f822df8cd2aa53be25');
 *
 * @param userKey    The user key
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to an user
 */
export async function get(
    userKey: string,
    optionals: RoutingOptions = {},
): Promise<PseudonymReadOutView> {
    return await new Router()
        .get(`/user/${userKey}`, optionals)
        .then(({ body }) => body);
}

export async function getWithHandle(
    handle: string,
    optionals: {
        modality?: Modality;
    } & RoutingOptions = {},
): Promise<PseudonymReadOutView> {
    const { modality, ...routingOptions } = optionals;
    const uriComponent = modality ? `/${modality}` : '';
    return await new Router()
        .get(`/user/with/${handle}${uriComponent}`, routingOptions)
        .then(({ body }) => body);
}
