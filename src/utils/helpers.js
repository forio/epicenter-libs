export const isNode = () => (typeof window === 'undefined' /* We don't check for process here b/c webpack generates a process global */);
export const isBrowser = () => (typeof window !== 'undefined');

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