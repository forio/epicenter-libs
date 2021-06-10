export const OK_CODE = 200;
export const CREATED_CODE = 201;
export const UNAUTHORIZED_CODE = 401;

export const ACCOUNT = 'forio-dev';
export const PROJECT = 'epi-v3';

export const SESSION_KEY = 'com.forio.epicenter.session';
// TODO -- clean this up before you're able to publish
export const SESSION = {
    token: '***REMOVED***',
    expires: true,
    timeoutMinutes: 240,
    groupRole: 'PARTICIPANT',
    loginMethod: { objectType: 'sso' },
    assignedWorldKeys: [],
    assignedWorldRoles: [],
    userHandle: 'myhandle',
    userKey: '0000015ffe4b5399ddcfcf72545a54c808ed',
    displayName: 'My Display Name',
    accountShortName: 'acme',
    projectShortName: 'simulations',
    groupName: 'mygroupname',
    groupKey: '00000163228dee7ddc347d0a5d6156d4a143',
    session: '***REMOVED***',
    objectType: 'user',
};

export const GENERIC_OPTIONS = {
    server: 'https://mydomain.com',
    accountShortName: 'myaccount',
    projectShortName: 'myproject',
};