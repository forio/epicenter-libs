export const OK_CODE = 200;
export const CREATED_CODE = 201;
export const UNAUTHORIZED_CODE = 401;

export const ACCOUNT = 'forio-dev';
export const PROJECT = 'epi-v3';

export const SESSION_KEY = 'com.forio.epicenter.session';
export const SESSION = {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJncmVldGluZ3MiOiJ0aGlzIGlzIGEgZHVtbXkgdGVzdCB0b2tlbiBmb3IgRXBpY2VudGVyIEpTIGxpYnMifQ.5B8wdwycKfuRpFkHMLUajUdO6jpYt6mC_uTGJJ6ftK4',
    expires: true,
    timeoutMinutes: 240,
    groupRole: 'PARTICIPANT',
    loginMethod: { objectType: 'sso' },
    assignedWorldKeys: [],
    assignedWorldRoles: [],
    userHandle: 'myhandle',
    userKey: '00000168bad586135710e2d9104c12846820',
    displayName: 'My Display Name',
    accountShortName: 'acme',
    projectShortName: 'simulations',
    groupName: 'mygroupname',
    groupKey: '00000165ad4e6a3cd22b993340b963820239',
    objectType: 'user',
};

export const GENERIC_OPTIONS = {
    server: 'https://mydomain.com',
    accountShortName: 'myaccount',
    projectShortName: 'myproject',
};
