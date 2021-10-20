export const OK_CODE = 200;
export const CREATED_CODE = 201;
export const UNAUTHORIZED_CODE = 401;

export const ACCOUNT = 'forio-dev';
export const PROJECT = 'epi-v3';

export const SESSION_KEY = 'com.forio.epicenter.session';
// TODO -- clean this up before you're able to publish
export const SESSION = {
    token: 'eyJ0eXAiOiJKV1QiLA0KICJhbGciOiJSUzI1NiJ9.IlVTRVI6MDAwMDAxNmZhMTYzM2FmOTE5N2ZiYzMzYTdiNDA3OTA4MDFjIg.JGyccGD3GPign77s_LvOumHko9TwUfCwMl2FbWEnnNy_ASYaYwBb4mn5X8pnDHS_hsTCeQR6OvPkG5_uOuDbEoBXc93c44Ww_kqqNlKmnv9648ubh4atChk6Fgxy4XjwSWWgef7GB75FGJ0j1PXoGCqADiTNughV5GTaoG-CudxMcNG_zb8lhqSgyV0HI6bB0MKGzCiJpEI_nmK_fuDT6MLRfH_b6cB_dP6s5KDwfIbNAF5o4jw9ly2cHPVnRxYPVzNAqvhqg8NTkq8x5m0zExqdE_8RHvKgWDYW9xyfF5Pj3tCBmxX_-rFnt7KfeOlbBuQssQ0WMa8gnp6GSOoxug',
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
    session: 'eyJ0eXAiOiJKV1QiLA0KICJhbGciOiJSUzI1NiJ9.IlVTRVI6MDAwMDAxNmZhMTYzM2FmOTE5N2ZiYzMzYTdiNDA3OTA4MDFjIg.JGyccGD3GPign77s_LvOumHko9TwUfCwMl2FbWEnnNy_ASYaYwBb4mn5X8pnDHS_hsTCeQR6OvPkG5_uOuDbEoBXc93c44Ww_kqqNlKmnv9648ubh4atChk6Fgxy4XjwSWWgef7GB75FGJ0j1PXoGCqADiTNughV5GTaoG-CudxMcNG_zb8lhqSgyV0HI6bB0MKGzCiJpEI_nmK_fuDT6MLRfH_b6cB_dP6s5KDwfIbNAF5o4jw9ly2cHPVnRxYPVzNAqvhqg8NTkq8x5m0zExqdE_8RHvKgWDYW9xyfF5Pj3tCBmxX_-rFnt7KfeOlbBuQssQ0WMa8gnp6GSOoxug',
    objectType: 'user',
};

export const GENERIC_OPTIONS = {
    server: 'https://mydomain.com',
    accountShortName: 'myaccount',
    projectShortName: 'myproject',
};

if (module.hot) {
    module.hot.accept(function() {
        window.location.reload();
    });
}
