/* eslint-disable no-new-func */
export const isBrowser = new Function('try {return this===window;}catch(e){ return false;}');
export const isNode = new Function('try {return this===global;}catch(e){return false;}');

export const toQueryString = (query) => {
    if (typeof query === 'string') return query;
    if (typeof query !== 'object') return '';
    const queryArray = Array.isArray(query) ? query : Object.entries(query);
    return queryArray.flatMap(([key, value]) => {
        if (key === undefined || key === '') return [];
        if (value === undefined || value === '') return [];
        if (Array.isArray(value)) return value.map((v) => `${key}=${v}`);
        return `${key}=${value}`;
    }).join('&');
};

export const last = (strOrArr) => strOrArr[strOrArr.length - 1];
export const prefix = (pre, str) => str.startsWith(pre) ? str : `${pre}${str}`;

// Tries to return value at the end of a sequence of keys.
// E.g. given an obj and keys = ['1', '2', '3'], it will try to
// return obj['1']['2']['3']. Uses the defaultValue on error.
export const access = (obj, keys, defaultValue) => {
    let ref = obj;
    try {
        keys.forEach((key) => ref = ref[key]);
    } catch (err) {
        if (err instanceof TypeError) {
            return defaultValue;
        }
        throw err;
    }
    if (ref === undefined) return defaultValue;
    return ref;
};